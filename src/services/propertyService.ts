import {
  collection,
  onSnapshot,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Property } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const PROPERTIES_COLLECTION = 'properties';
const DELETED_PROPERTIES_KEY = 'mef_deleted_property_ids';
const CUSTOM_PROPERTIES_KEY = 'mef_custom_properties';

export const getDeletedPropertyIds = (): string[] => {
  try {
    const raw = localStorage.getItem(DELETED_PROPERTIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const markPropertyAsDeletedLocal = (id: string, refCode?: string) => {
  try {
    const current = getDeletedPropertyIds();
    const toAdd = [id];
    if (refCode && refCode !== id) toAdd.push(refCode);
    const updated = Array.from(new Set([...current, ...toAdd]));
    localStorage.setItem(DELETED_PROPERTIES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('mef_local_properties_updated'));
  } catch (e) {
    console.warn('Error marking property as deleted locally:', e);
  }
};

export const getCustomLocalProperties = (): Property[] => {
  try {
    const raw = localStorage.getItem(CUSTOM_PROPERTIES_KEY);
    if (!raw) return [];
    
    let properties: Property[] = JSON.parse(raw);
    const deletedIds = new Set(getDeletedPropertyIds());
    
    // Filter out deleted properties and legacy short-id samples
    properties = properties.filter(
      p => p.id && p.id.toString().length > 5 && !deletedIds.has(p.id) && (!p.refCode || !deletedIds.has(p.refCode))
    );
    
    return properties;
  } catch {
    return [];
  }
};

export const saveCustomLocalProperty = (property: Property) => {
  try {
    const current = getCustomLocalProperties();
    const cleanProp: Property = {
      ...property,
      statusBanner: property.statusBanner && property.statusBanner !== 'NINGUNA' ? property.statusBanner : undefined,
    };
    // Unmark as deleted if it was previously in deleted list
    const deleted = getDeletedPropertyIds();
    const filteredDeleted = deleted.filter(d => d !== cleanProp.id && d !== cleanProp.refCode);
    if (filteredDeleted.length !== deleted.length) {
      localStorage.setItem(DELETED_PROPERTIES_KEY, JSON.stringify(filteredDeleted));
    }

    const idx = current.findIndex((p) => p.id === cleanProp.id || (p.refCode && p.refCode === cleanProp.refCode));
    if (idx >= 0) {
      current[idx] = cleanProp;
    } else {
      current.unshift(cleanProp);
    }
    localStorage.setItem(CUSTOM_PROPERTIES_KEY, JSON.stringify(current));
    window.dispatchEvent(new Event('mef_local_properties_updated'));
  } catch (e) {
    console.warn('Error saving custom property to localStorage:', e);
  }
};

export const removeCustomLocalProperty = (id: string, refCode?: string) => {
  try {
    const current = getCustomLocalProperties();
    const filtered = current.filter((p) => p.id !== id && (!refCode || p.refCode !== refCode));
    localStorage.setItem(CUSTOM_PROPERTIES_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event('mef_local_properties_updated'));
  } catch (e) {
    console.warn('Error removing custom property from localStorage:', e);
  }
};

// Helper to convert Firestore doc to Property
const mapDocToProperty = (id: string, data: any): Property => {
  return {
    id,
    displayOrder: data.displayOrder !== undefined ? Number(data.displayOrder) : undefined,
    refCode: data.refCode || `SC-${id.slice(0, 5).toUpperCase()}`,
    title: data.title || 'Propiedad sin título',
    operation: data.operation || 'VENTA',
    type: data.type || 'Casa',
    priceUSD: Number(data.priceUSD) || 0,
    priceARS: data.priceARS ? Number(data.priceARS) : undefined,
    expensesARS: data.expensesARS ? Number(data.expensesARS) : 0,
    location: {
      zone: data.location?.zone || 'Azul - Centro',
      address: data.location?.address || '',
      city: data.location?.city || 'Azul',
      lat: Number(data.location?.lat) || -36.7769,
      lng: Number(data.location?.lng) || -59.8585,
    },
    coveredArea: Number(data.coveredArea) || 0,
    totalArea: Number(data.totalArea) || 0,
    bedrooms: Number(data.bedrooms) || 0,
    bathrooms: Number(data.bathrooms) || 0,
    garages: Number(data.garages) || 0,
    description: data.description || '',
    images: Array.isArray(data.images) && data.images.length > 0
      ? data.images
      : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'],
    featured: Boolean(data.featured),
    isNewDevelopment: Boolean(data.isNewDevelopment),
    isRecentlyUploaded: Boolean(data.isRecentlyUploaded),
    statusBanner: data.statusBanner && data.statusBanner !== 'NINGUNA' ? data.statusBanner : undefined,
    videoUrl: data.videoUrl || '',
    videoType: data.videoType || (data.videoUrl?.includes('youtube') ? 'youtube' : 'mp4'),
    instagramUrl: data.instagramUrl || '',
    amenities: Array.isArray(data.amenities) ? data.amenities : [],
    lotFeatures: data.lotFeatures || undefined,
    agent: {
      name: data.agent?.name || 'Angelini Inmobiliaria',
      phone: data.agent?.phone || '+54 9 2281 301464',
      email: data.agent?.email || 'contacto@angeliniinmobiliaria.ar',
      avatar: data.agent?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    },
    createdAt: data.createdAt || new Date().toISOString().split('T')[0],
  };
};

const getCombinedLocalProperties = (): Property[] => {
  const deletedIds = getDeletedPropertyIds();
  const customLocal = getCustomLocalProperties();

  const customFiltered = customLocal.filter((p) => !deletedIds.includes(p.id));
  const customIds = new Set(customFiltered.map((p) => p.id));
  const customRefCodes = new Set(customFiltered.map((p) => p.refCode).filter(Boolean));

  const list: Property[] = [...customFiltered];

  // Sort properties to prevent random jumping
  list.sort((a, b) => {
    if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
      if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
    } else if (a.displayOrder !== undefined) {
      return -1;
    } else if (b.displayOrder !== undefined) {
      return 1;
    }

    if (a.isRecentlyUploaded && !b.isRecentlyUploaded) return -1;
    if (!a.isRecentlyUploaded && b.isRecentlyUploaded) return 1;
    
    const dateA = new Date(a.createdAt || '2000-01-01').getTime();
    const dateB = new Date(b.createdAt || '2000-01-01').getTime();
    if (dateA !== dateB) return dateB - dateA;
    
    return a.id.localeCompare(b.id);
  });

  return list;
};

/**
 * Subscribe to realtime properties list from Firestore.
 * Merges Firestore documents with sample catalog properties without losing un-edited properties.
 */
export const subscribeToProperties = (
  onUpdate: (properties: Property[], isFromFirebase: boolean) => void,
  onError?: (err: any) => void
) => {
  try {
    const handleLocalUpdate = () => onUpdate(getCombinedLocalProperties(), false);
    
    // ALWAYS load local properties instantly first to prevent empty state if Firebase hangs
    handleLocalUpdate();

    if (!db) {
      window.addEventListener('mef_local_properties_updated', handleLocalUpdate);
      return () => {
        window.removeEventListener('mef_local_properties_updated', handleLocalUpdate);
      };
    }

    const propertiesRef = collection(db, PROPERTIES_COLLECTION);
    const q = query(propertiesRef);

    return onSnapshot(
      q,
      (snapshot) => {
        const deletedIds = new Set(getDeletedPropertyIds());

        if (snapshot.empty) {
          console.log('Firestore collection is empty. Auto-syncing custom local properties...');
          const customLocal = getCustomLocalProperties().filter(
            p => !deletedIds.has(p.id) && (!p.refCode || !deletedIds.has(p.refCode))
          );
          
          customLocal.forEach((prop) => {
            const docRef = doc(db, PROPERTIES_COLLECTION, prop.id);
            setDoc(docRef, {
              ...prop,
              updatedAt: Timestamp.now(),
            }).catch((e) => console.warn('Error auto-seeding property to Firestore:', e));
          });

          // Deliver local custom properties while Firestore populates
          onUpdate(customLocal, true);
          return;
        }

        const firestorePropsMap = new Map<string, Property>();
        snapshot.docs.forEach((docSnap) => {
          const prop = mapDocToProperty(docSnap.id, docSnap.data());
          // If property is in deleted list, purge it from Firestore and ignore
          if (deletedIds.has(docSnap.id) || deletedIds.has(prop.id) || (prop.refCode && deletedIds.has(prop.refCode))) {
            deleteDoc(docSnap.ref).catch(() => {});
            return;
          }
          firestorePropsMap.set(prop.id, prop);
        });

        // Add local custom properties if they aren't in Firestore yet
        const customLocal = getCustomLocalProperties();
        customLocal.forEach((customProp) => {
          if (deletedIds.has(customProp.id) || (customProp.refCode && deletedIds.has(customProp.refCode))) {
            return;
          }
          if (!firestorePropsMap.has(customProp.id)) {
            firestorePropsMap.set(customProp.id, customProp);
            
            // Try to auto-sync it to Firestore since it's missing
            const docRef = doc(db, PROPERTIES_COLLECTION, customProp.id);
            setDoc(docRef, {
              ...customProp,
              updatedAt: Timestamp.now(),
            }).catch((e) => console.warn('Auto-sync local property notice:', e));
          }
        });

        const firestoreList: Property[] = Array.from(firestorePropsMap.values());

        firestoreList.sort((a, b) => {
          if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
            if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
          } else if (a.displayOrder !== undefined) {
            return -1;
          } else if (b.displayOrder !== undefined) {
            return 1;
          }

          if (a.isRecentlyUploaded && !b.isRecentlyUploaded) return -1;
          if (!a.isRecentlyUploaded && b.isRecentlyUploaded) return 1;
          
          const dateA = new Date(a.createdAt || '2000-01-01').getTime();
          const dateB = new Date(b.createdAt || '2000-01-01').getTime();
          if (dateA !== dateB) return dateB - dateA;
          
          return a.id.localeCompare(b.id);
        });

        onUpdate(firestoreList, true);
      },
      (error) => {
        // Silently fall back to local storage catalog if Firestore rule or connection is pending
        if (onError) onError(error);
        onUpdate(getCombinedLocalProperties(), false);
      }
    );
  } catch (err) {
    console.error('Error attaching listener to Firestore:', err);
    onUpdate(getCombinedLocalProperties(), false);
    return () => {};
  }
};

// Helper to remove undefined fields for Firestore compatibility
const removeUndefinedValues = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(removeUndefinedValues);
  }
  const cleaned: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val !== undefined) {
      cleaned[key] = removeUndefinedValues(val);
    }
  }
  return cleaned;
};

/**
 * Add a new property to Firestore (and fallback to localStorage).
 */
export const addPropertyToFirestore = async (propertyData: Omit<Property, 'id'>): Promise<string> => {
  let docId = `mef-${Date.now()}`;

  if (propertyData.featured) {
    const currentLocal = getCustomLocalProperties();
    const updatedLocal = currentLocal.map((p) => ({ ...p, featured: false }));
    localStorage.setItem(CUSTOM_PROPERTIES_KEY, JSON.stringify(updatedLocal));
    window.dispatchEvent(new Event('mef_local_properties_updated'));

    if (db) {
      try {
        const querySnapshot = await getDocs(collection(db, PROPERTIES_COLLECTION));
        const updates = querySnapshot.docs.map(docSnap =>
          updateDoc(doc(db, PROPERTIES_COLLECTION, docSnap.id), { featured: false })
        );
        await Promise.all(updates);
      } catch (e) {
        console.warn('Error clearing other featured properties in Firestore:', e);
      }
    }
  }

  const fullProp: Property = { id: docId, ...propertyData };
  saveCustomLocalProperty(fullProp);

  if (db) {
    try {
      const cleanData = removeUndefinedValues({
        ...propertyData,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: Timestamp.now(),
      });
      await setDoc(doc(db, PROPERTIES_COLLECTION, docId), cleanData);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `${PROPERTIES_COLLECTION}/${docId}`);
    }
  }

  return docId;
};

/**
 * Update an existing property in Firestore (and localStorage).
 */
export const updatePropertyInFirestore = async (id: string, propertyData: Partial<Property>) => {
  if (propertyData.featured) {
    const currentLocal = getCustomLocalProperties();
    const updatedLocal = currentLocal.map((p) => ({
      ...p,
      featured: p.id === id ? true : false,
    }));
    localStorage.setItem(CUSTOM_PROPERTIES_KEY, JSON.stringify(updatedLocal));
    window.dispatchEvent(new Event('mef_local_properties_updated'));

    if (db) {
      try {
        const querySnapshot = await getDocs(collection(db, PROPERTIES_COLLECTION));
        const updates = querySnapshot.docs
          .filter(docSnap => docSnap.id !== id)
          .map(docSnap =>
            updateDoc(doc(db, PROPERTIES_COLLECTION, docSnap.id), { featured: false })
          );
        await Promise.all(updates);
      } catch (e) {
        console.warn('Error clearing other featured properties in Firestore on update:', e);
      }
    }
  }

  const currentLocal = getCustomLocalProperties();
  const existing = currentLocal.find((p) => p.id === id);
  if (existing) {
    saveCustomLocalProperty({ ...existing, ...propertyData } as Property);
  }

  if (db) {
    try {
      const docRef = doc(db, PROPERTIES_COLLECTION, id);
      const cleanData = removeUndefinedValues({
        ...propertyData,
        updatedAt: Timestamp.now(),
      });
      await setDoc(docRef, cleanData, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `${PROPERTIES_COLLECTION}/${id}`);
    }
  }
};

/**
 * Delete a property from Firestore (and localStorage).
 */
export const deletePropertyFromFirestore = async (id: string, refCode?: string) => {
  markPropertyAsDeletedLocal(id, refCode);
  removeCustomLocalProperty(id, refCode);

  if (db) {
    try {
      // 1. Direct doc deletion
      const docRef = doc(db, PROPERTIES_COLLECTION, id);
      await deleteDoc(docRef).catch(() => {});

      if (refCode && refCode !== id) {
        const refDocRef = doc(db, PROPERTIES_COLLECTION, refCode);
        await deleteDoc(refDocRef).catch(() => {});
      }

      // 2. Query and delete all matching documents (by doc.id, id property or refCode)
      const qSnap = await getDocs(collection(db, PROPERTIES_COLLECTION));
      const deletePromises: Promise<void>[] = [];
      
      qSnap.forEach((dSnap) => {
        const data = dSnap.data();
        if (
          dSnap.id === id || 
          (refCode && dSnap.id === refCode) ||
          data.id === id || 
          (refCode && data.refCode === refCode)
        ) {
          deletePromises.push(deleteDoc(dSnap.ref).catch(() => {}));
        }
      });

      if (deletePromises.length > 0) {
        await Promise.all(deletePromises);
      }
    } catch (e) {
      console.warn('Notice during Firestore deleteDoc:', e);
      try {
        handleFirestoreError(e, OperationType.DELETE, `${PROPERTIES_COLLECTION}/${id}`);
      } catch {
        // Fallback gracefully so local deletion is never blocked
      }
    }
  }
};

export const seedSamplePropertiesToFirestore = async () => {};

export const updatePropertiesOrder = async (updates: { id: string; displayOrder: number }[]) => {
  // Update local storage too so local custom properties retain their order
  const customLocal = getCustomLocalProperties();
  let localUpdated = false;
  
  updates.forEach(update => {
    const localProp = customLocal.find(p => p.id === update.id);
    if (localProp) {
      localProp.displayOrder = update.displayOrder;
      localUpdated = true;
    }
  });

  if (localUpdated) {
    localStorage.setItem(CUSTOM_PROPERTIES_KEY, JSON.stringify(customLocal));
    window.dispatchEvent(new Event('mef_local_properties_updated'));
  }

  if (!db) return;
  try {
    const promises = updates.map(update => {
      const docRef = doc(db, PROPERTIES_COLLECTION, update.id);
      return setDoc(docRef, { displayOrder: update.displayOrder, updatedAt: Timestamp.now() }, { merge: true }).catch(e => {
        console.warn(`Failed to update displayOrder for ${update.id}:`, e);
      });
    });
    await Promise.all(promises);
  } catch (e) {
    console.warn('Error updating properties order:', e);
  }
};

/**
 * Export all properties (custom + catalog) as a JSON backup file.
 */
export const exportPropertiesBackupJSON = (propertiesList: Property[]) => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(propertiesList, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `mef_propiedades_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

/**
 * Import properties from a JSON string or array, saving them locally and to Firestore.
 */
export const importPropertiesBackupJSON = async (rawJSON: string): Promise<number> => {
  const parsed = JSON.parse(rawJSON);
  const items: Property[] = Array.isArray(parsed) ? parsed : [parsed];
  
  if (items.length === 0) return 0;

  // Clear local deleted list so imported items show up
  localStorage.removeItem(DELETED_PROPERTIES_KEY);
  window.dispatchEvent(new Event('mef_local_properties_updated'));

  let count = 0;
  const firestorePromises: Promise<void>[] = [];

  for (const item of items) {
    if (item && item.title) {
      const propToSave: Property = {
        ...item,
        id: item.id || `mef-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      };
      saveCustomLocalProperty(propToSave);

      if (db) {
        const docRef = doc(db, PROPERTIES_COLLECTION, propToSave.id);
        const p = setDoc(docRef, {
          ...propToSave,
          updatedAt: Timestamp.now(),
        }, { merge: true }).catch((e) => {
          console.warn('Firestore sync warning during import:', e);
        });
        firestorePromises.push(p);
      }
      count++;
    }
  }

  // We do not await firestorePromises here because if Firestore is misconfigured
  // or offline, it could hang and prevent the UI from showing the local success alert.
  
  return count;
};

/**
 * Explicitly sync all local properties directly into Firebase Firestore.
 */
export const syncAllLocalToFirestore = async (): Promise<number> => {
  const localProps = getCustomLocalProperties();
  if (localProps.length === 0) return 0;
  
  if (!db) {
    throw new Error('Firebase no está inicializado.');
  }

  let count = 0;
  for (const prop of localProps) {
    const docRef = doc(db, PROPERTIES_COLLECTION, prop.id);
    const writePromise = setDoc(docRef, {
      ...prop,
      updatedAt: Timestamp.now(),
    }, { merge: true });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('No se pudo conectar con Firebase. La base de datos no está activa aún.')), 5000)
    );

    await Promise.race([writePromise, timeoutPromise]);
    count++;
  }
  return count;
};


