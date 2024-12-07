import { db, auth } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot,
  enableNetwork,
  disableNetwork
} from 'firebase/firestore';

let retryCount = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryOperation<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    if (retryCount < MAX_RETRIES && error?.code === 'unavailable') {
      retryCount++;
      await delay(RETRY_DELAY * retryCount);
      
      // Try to re-enable network connection
      try {
        await enableNetwork(db);
      } catch {
        // Ignore network enable errors
      }
      
      return retryOperation(operation);
    }
    throw error;
  }
}

export const saveFavorites = async (favorites: string[]) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    await retryOperation(async () => {
      await setDoc(doc(db, 'favorites', user.uid), {
        names: favorites,
        updatedAt: new Date().toISOString()
      });
    });
  } catch (error) {
    console.error('Error saving favorites:', error);
    throw error;
  }
};

export const getFavorites = async (): Promise<string[]> => {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    return await retryOperation(async () => {
      const docRef = doc(db, 'favorites', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data().names || [];
      }
      return [];
    });
  } catch (error) {
    console.error('Error getting favorites:', error);
    throw error;
  }
};

export const subscribeFavorites = (
  userId: string,
  onUpdate: (favorites: string[]) => void
) => {
  let unsubscribe: (() => void) | null = null;

  const subscribe = () => {
    unsubscribe = onSnapshot(
      doc(db, 'favorites', userId),
      (doc) => {
        if (doc.exists()) {
          onUpdate(doc.data().names || []);
        }
      },
      async (error) => {
        console.error('Error subscribing to favorites:', error);
        
        if (error.code === 'unavailable') {
          // Try to reconnect
          try {
            await disableNetwork(db);
            await enableNetwork(db);
            
            // Resubscribe after network reset
            if (unsubscribe) {
              unsubscribe();
              subscribe();
            }
          } catch (reconnectError) {
            console.error('Error reconnecting:', reconnectError);
          }
        }
      }
    );
  };

  subscribe();
  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
};