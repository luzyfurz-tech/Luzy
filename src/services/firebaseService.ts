import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  increment,
  updateDoc,
  deleteDoc,
  Timestamp,
  writeBatch,
  arrayUnion
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../firebase';
export { db, auth, storage };

export const uploadImage = async (file: File, path: string) => {
  try {
    const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

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
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// User Services
export const createUserProfile = async (uid: string, email: string, role: string = 'customer') => {
  const path = `users/${uid}`;
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', uid), {
        uid,
        email,
        role,
        coins: 50, // Initial free coins
        isVip: false,
        gallery: [],
        freeMessagesToday: 0,
        lastFreeMessageReset: serverTimestamp(),
        isProfileComplete: false,
        createdAt: serverTimestamp()
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getUserProfile = async (uid: string) => {
  const path = `users/${uid}`;
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

export const getAllUsers = async () => {
  const path = 'users';
  try {
    const q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(100));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
};

export const updateUserCoins = async (uid: string, amount: number) => {
  const path = `users/${uid}`;
  try {
    await updateDoc(doc(db, 'users', uid), {
      coins: increment(amount)
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const updateUserVip = async (uid: string, isVip: boolean) => {
  const path = `users/${uid}`;
  try {
    await updateDoc(doc(db, 'users', uid), { isVip });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

// Fantasy Profile Services
export const getFantasyProfiles = async () => {
  const path = 'fantasyProfiles';
  try {
    const q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(100));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
};

export const createFantasyProfile = async (data: any) => {
  const path = 'fantasyProfiles';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...data,
      isFantasy: true,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const updateFantasyProfile = async (id: string, data: any) => {
  const path = `fantasyProfiles/${id}`;
  try {
    await updateDoc(doc(db, 'fantasyProfiles', id), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const deleteFantasyProfile = async (id: string) => {
  const path = `fantasyProfiles/${id}`;
  try {
    await deleteDoc(doc(db, 'fantasyProfiles', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

// Chat Services
export const createChat = async (customerId: string, fantasyId: string) => {
  const path = 'chats';
  try {
    // Check if chat already exists
    const q = query(
      collection(db, path), 
      where('customerId', '==', customerId),
      where('fantasyId', '==', fantasyId)
    );
    const existing = await getDocs(q);
    if (!existing.empty) return existing.docs[0].id;

    const docRef = await addDoc(collection(db, path), {
      customerId,
      fantasyId,
      lastMessage: '',
      lastTimestamp: serverTimestamp(),
      unreadCount: 0,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const sendMessage = async (chatId: string, senderId: string, receiverId: string, text: string, imageUrl?: string) => {
  const chatPath = `chats/${chatId}`;
  const messagePath = `chats/${chatId}/messages`;
  try {
    const sender = await getUserProfile(senderId);
    
    // Get system settings for prices
    const settingsDoc = await getDoc(doc(db, 'system', 'settings'));
    const settings = settingsDoc.exists() ? settingsDoc.data() : {
      prices: { basicMessage: 4, vipMessage: 2, imageMessage: 5 },
      vipBenefits: { freeMessagesPerDay: 5 }
    };

    let cost = 0;
    let isLocked = false;
    let useFreeMessage = false;

    if (sender?.role === 'customer') {
      // Check for free message reset
      const now = new Date();
      const lastReset = sender.lastFreeMessageReset?.toDate() || new Date(0);
      const isNewDay = now.toDateString() !== lastReset.toDateString();
      
      let freeMessagesToday = isNewDay ? 0 : (sender.freeMessagesToday || 0);
      const maxFree = settings.vipBenefits?.freeMessagesPerDay || 5;
      
      if (sender.isVip && freeMessagesToday < maxFree && !imageUrl) {
        useFreeMessage = true;
        cost = 0;
      } else {
        if (imageUrl) {
          cost = settings.prices?.imageMessage || 5;
        } else {
          cost = sender.isVip ? (settings.prices?.vipMessage || 2) : (settings.prices?.basicMessage || 4);
        }
      }

      // Update free messages count and reset timestamp if needed
      if (isNewDay || useFreeMessage) {
        await updateDoc(doc(db, 'users', senderId), {
          freeMessagesToday: useFreeMessage ? freeMessagesToday + 1 : 0,
          lastFreeMessageReset: serverTimestamp()
        });
      }
    }

    // Fantasy users reply for free
    const senderIsFantasy = !sender || sender.role === 'moderator' || (await getDoc(doc(db, 'fantasyProfiles', senderId))).exists();
    if (senderIsFantasy) cost = 0;

    if (cost > 0) {
      if (sender.coins < cost) throw new Error('Insufficient coins');
      await updateDoc(doc(db, 'users', senderId), {
        coins: increment(-cost)
      });
    }

    // If it's an image, it's locked for basic users (receivers)
    if (imageUrl) {
      isLocked = true; // Initially locked, will be checked by receiver's VIP status in UI
    }

    await addDoc(collection(db, messagePath), {
      chatId,
      senderId,
      receiverId,
      text,
      imageUrl,
      isLocked,
      timestamp: serverTimestamp(),
      isRead: false
    });

    await updateDoc(doc(db, chatPath), {
      lastMessage: imageUrl ? '📷 Billede' : text,
      lastTimestamp: serverTimestamp(),
      unreadCount: increment(1)
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, messagePath);
  }
};

export const unlockMessageImage = async (chatId: string, messageId: string, userId: string) => {
  const path = `chats/${chatId}/messages/${messageId}`;
  try {
    const user = await getUserProfile(userId);
    if (!user.isVip) {
      const settingsDoc = await getDoc(doc(db, 'system', 'settings'));
      const unlockCost = settingsDoc.exists() ? (settingsDoc.data().prices?.unlockImage || 5) : 5;
      
      if (user.coins < unlockCost) throw new Error('Insufficient coins');
      await updateDoc(doc(db, 'users', userId), {
        coins: increment(-unlockCost)
      });
    }
    
    await updateDoc(doc(db, 'chats', chatId, 'messages', messageId), {
      isLocked: false,
      unlockedBy: arrayUnion(userId)
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getChatsForUser = (userId: string, callback: (chats: any[]) => void) => {
  const path = 'chats';
  const q1 = query(collection(db, path), where('customerId', '==', userId), orderBy('lastTimestamp', 'desc'));
  const q2 = query(collection(db, path), where('fantasyId', '==', userId), orderBy('lastTimestamp', 'desc'));
  
  // For simplicity in this example, we'll just listen to customerId matches
  // In a real app, you'd combine these or use a different structure
  return onSnapshot(q1, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
};

export const updateUserProfile = async (uid: string, data: any) => {
  const path = `users/${uid}`;
  try {
    await updateDoc(doc(db, 'users', uid), {
      ...data,
      isProfileComplete: true
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const seedFantasyProfiles = async () => {
  const path = 'fantasyProfiles';
  const profiles = [
    { username: 'Isabella', age: 24, city: 'Aarhus', gender: 'Kvinde', seekingGender: 'Mand', status: 'Eventyrlysten', about: 'Kunstnerisk sjæl der elsker at rejse.', backstory: 'Isabella er opvokset i en lille by men drømmer om storbyen.', interests: ['Kunst', 'Rejser', 'Vin'] },
    { username: 'Sofia', age: 22, city: 'København', gender: 'Kvinde', seekingGender: 'Mand', status: 'Studerende', about: 'Elsker kaffe og gode bøger.', backstory: 'Sofia læser litteratur på KU.', interests: ['Bøger', 'Kaffe', 'Yoga'] },
    { username: 'Emma', age: 26, city: 'Odense', gender: 'Kvinde', seekingGender: 'Mand', status: 'Arbejdende', about: 'Fitness entusiast og madelsker.', backstory: 'Emma arbejder som personlig træner.', interests: ['Fitness', 'Mad', 'Løb'] },
    { username: 'Olivia', age: 23, city: 'Aalborg', gender: 'Kvinde', seekingGender: 'Mand', status: 'Single', about: 'Musik er mit liv.', backstory: 'Olivia spiller guitar i et band.', interests: ['Musik', 'Koncerter', 'Dans'] },
    { username: 'Freja', age: 25, city: 'Roskilde', gender: 'Kvinde', seekingGender: 'Mand', status: 'Søgende', about: 'Naturen giver mig ro.', backstory: 'Freja elsker at vandre.', interests: ['Vandring', 'Natur', 'Foto'] },
    { username: 'Alma', age: 21, city: 'Esbjerg', gender: 'Kvinde', seekingGender: 'Mand', status: 'Glad', about: 'Altid et smil på læben.', backstory: 'Alma studerer pædagogik.', interests: ['Børn', 'Dyr', 'Bagning'] },
    { username: 'Clara', age: 27, city: 'Vejle', gender: 'Kvinde', seekingGender: 'Mand', status: 'Karriere', about: 'Fokuseret og ambitiøs.', backstory: 'Clara arbejder i marketing.', interests: ['Business', 'Netværk', 'Golf'] },
    { username: 'Ida', age: 24, city: 'Horsens', gender: 'Kvinde', seekingGender: 'Mand', status: 'Kreativ', about: 'Elsker at male.', backstory: 'Ida har sit eget lille atelier.', interests: ['Maling', 'Design', 'Mode'] },
    { username: 'Laura', age: 22, city: 'Randers', gender: 'Kvinde', seekingGender: 'Mand', status: 'Sød', about: 'Hunde er mine bedste venner.', backstory: 'Laura har to hunde.', interests: ['Hunde', 'Gåture', 'Film'] },
    { username: 'Mathilde', age: 26, city: 'Kolding', gender: 'Kvinde', seekingGender: 'Mand', status: 'Aktiv', about: 'Elsker sport.', backstory: 'Mathilde spiller håndbold.', interests: ['Håndbold', 'Sport', 'Venner'] },
    { username: 'Maja', age: 23, city: 'Helsingør', gender: 'Kvinde', seekingGender: 'Mand', status: 'Drømmende', about: 'Elsker havet.', backstory: 'Maja bor tæt på vandet.', interests: ['Sejlads', 'Strand', 'Sommer'] },
    { username: 'Lærke', age: 25, city: 'Silkeborg', gender: 'Kvinde', seekingGender: 'Mand', status: 'Naturlig', about: 'Elsker skoven.', backstory: 'Lærke er vokset op i Silkeborg.', interests: ['Cykling', 'Skov', 'MTB'] },
    { username: 'Sofie', age: 21, city: 'Herning', gender: 'Kvinde', seekingGender: 'Mand', status: 'Ung', about: 'Elsker fester.', backstory: 'Sofie elsker at gå i byen.', interests: ['Fest', 'Drinks', 'Shopping'] },
    { username: 'Anna', age: 28, city: 'Næstved', gender: 'Kvinde', seekingGender: 'Mand', status: 'Moden', about: 'Søger noget seriøst.', backstory: 'Anna arbejder som sygeplejerske.', interests: ['Madlavning', 'Have', 'Børn'] },
    { username: 'Karla', age: 24, city: 'Viborg', gender: 'Kvinde', seekingGender: 'Mand', status: 'Sjov', about: 'Altid klar på en joke.', backstory: 'Karla er kendt for sit humør.', interests: ['Comedy', 'Spil', 'Quiz'] },
    { username: 'Victoria', age: 23, city: 'Holstebro', gender: 'Kvinde', seekingGender: 'Mand', status: 'Elegant', about: 'Elsker mode.', backstory: 'Victoria drømmer om at blive model.', interests: ['Mode', 'Makeup', 'Foto'] },
    { username: 'Josefine', age: 22, city: 'Slagelse', gender: 'Kvinde', seekingGender: 'Mand', status: 'Rolig', about: 'Elsker meditation.', backstory: 'Josefine dyrker meget yoga.', interests: ['Yoga', 'Meditation', 'Te'] },
    { username: 'Alberte', age: 25, city: 'Sønderborg', gender: 'Kvinde', seekingGender: 'Mand', status: 'Frisk', about: 'Elsker vandsport.', backstory: 'Alberte er god til at surfe.', interests: ['Surf', 'Svømning', 'Sol'] },
    { username: 'Filippa', age: 24, city: 'Hjørring', gender: 'Kvinde', seekingGender: 'Mand', status: 'Nysgerrig', about: 'Elsker at lære nyt.', backstory: 'Filippa læser til lærer.', interests: ['Historie', 'Sprog', 'Rejser'] },
    { username: 'Agnes', age: 27, city: 'Holbæk', gender: 'Kvinde', seekingGender: 'Mand', status: 'Stabil', about: 'Elsker tryghed.', backstory: 'Agnes arbejder i en bank.', interests: ['Økonomi', 'Bolig', 'Mad'] }
  ];

  try {
    const batch = writeBatch(db);
    for (const profile of profiles) {
      const docRef = doc(collection(db, path));
      batch.set(docRef, {
        ...profile,
        isFantasy: true,
        gallery: [`https://picsum.photos/seed/${profile.username}/600/800`],
        createdAt: serverTimestamp()
      });
    }
    await batch.commit();
    console.log('Seed completed');
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const seedTestUsersAndMessages = async () => {
  try {
    const fantasyProfiles = await getFantasyProfiles();
    if (!fantasyProfiles || fantasyProfiles.length < 2) {
      await seedFantasyProfiles();
    }
    const updatedFantasyProfiles = await getFantasyProfiles();
    
    const testUsers = [
      { email: 'test_user_1@example.com', uid: 'test_uid_1', username: 'Mads88', city: 'Aarhus', age: 34 },
      { email: 'test_user_2@example.com', uid: 'test_uid_2', username: 'Thomas_K', city: 'København', age: 28 },
      { email: 'test_user_3@example.com', uid: 'test_uid_3', username: 'Lars_Vejle', city: 'Vejle', age: 45 }
    ];

    for (const user of testUsers) {
      await setDoc(doc(db, 'users', user.uid), {
        ...user,
        role: 'customer',
        coins: 100,
        isProfileComplete: true,
        createdAt: serverTimestamp()
      });

      // Send a message to a random fantasy profile
      const randomFantasy = updatedFantasyProfiles![Math.floor(Math.random() * updatedFantasyProfiles!.length)] as any;
      const chatId = await createChat(user.uid, randomFantasy.id);
      if (chatId) {
        await sendMessage(chatId, user.uid, randomFantasy.id, `Hej ${randomFantasy.username}, hvordan går det? Jeg så din profil og synes du ser rigtig sød ud.`);
      }
    }
    console.log('Test users and messages seeded');
  } catch (error) {
    console.error('Error seeding test data:', error);
  }
};

export const getSystemStats = async () => {
  try {
    const usersSnap = await getDocs(collection(db, 'users'));
    const chatsSnap = await getDocs(collection(db, 'chats'));
    const fantasySnap = await getDocs(collection(db, 'fantasy_profiles'));
    
    let totalRevenue = 0;
    let vipCount = 0;
    let basisCount = 0;
    
    usersSnap.forEach(doc => {
      const data = doc.data();
      totalRevenue += (data.totalSpent || 0);
      if (data.isVip) vipCount++;
      else basisCount++;
    });

    const topFantasyProfiles = fantasySnap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => (b.likeCount || 0) - (a.likeCount || 0))
      .slice(0, 5);

    return {
      totalUsers: usersSnap.size,
      totalChats: chatsSnap.size,
      totalMessages: chatsSnap.docs.reduce((acc, doc) => acc + (doc.data().messageCount || 0), 0),
      totalRevenue,
      userDistribution: { vip: vipCount, basis: basisCount },
      topFantasyProfiles
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'stats');
  }
};

export const getChatMessages = (chatId: string, callback: (messages: any[]) => void) => {
  const path = `chats/${chatId}/messages`;
  const q = query(collection(db, path), orderBy('timestamp', 'asc'), limit(100));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
};

export const getNextQueuedChat = async () => {
  const path = 'chats';
  try {
    // Find chats with unread messages, ordered by oldest lastTimestamp first
    const q = query(
      collection(db, path), 
      where('unreadCount', '>', 0),
      orderBy('unreadCount'), // Required for inequality filter on unreadCount
      orderBy('lastTimestamp', 'asc'),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

export const getActiveChats = (callback: (chats: any[]) => void) => {
  const path = 'chats';
  const q = query(collection(db, path), orderBy('lastTimestamp', 'desc'), limit(50));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
};

export const markChatAsRead = async (chatId: string) => {
  const path = `chats/${chatId}`;
  try {
    await updateDoc(doc(db, 'chats', chatId), {
      unreadCount: 0
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

// Like & Match Services
export const likeProfile = async (fromId: string, toId: string) => {
  const path = 'likes';
  try {
    // 1. Create the like
    const likeId = `${fromId}_${toId}`;
    await setDoc(doc(db, 'likes', likeId), {
      fromId,
      toId,
      timestamp: serverTimestamp()
    });

    // 2. Check for mutual like
    const reverseLikeId = `${toId}_${fromId}`;
    const reverseLike = await getDoc(doc(db, 'likes', reverseLikeId));

    if (reverseLike.exists()) {
      // It's a match!
      const matchId = fromId < toId ? `${fromId}_${toId}` : `${toId}_${fromId}`;
      await setDoc(doc(db, 'matches', matchId), {
        users: [fromId, toId],
        timestamp: serverTimestamp()
      });
      return true; // Match created
    }
    return false; // Just a like
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getMatches = (userId: string, callback: (matches: any[]) => void) => {
  const path = 'matches';
  const q = query(
    collection(db, path),
    where('users', 'array-contains', userId),
    orderBy('timestamp', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
};

// System Settings Services
export const boostProfile = async (uid: string, durationHours: number, cost: number) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) throw new Error('User not found');
  
  const userData = userSnap.data();
  if ((userData.coins || 0) < cost) throw new Error('Insufficient coins');
  
  const boostUntil = new Date();
  boostUntil.setHours(boostUntil.getHours() + durationHours);
  
  await updateDoc(userRef, {
    coins: increment(-cost),
    boostUntil: Timestamp.fromDate(boostUntil)
  });
  
  return boostUntil;
};

export const getSystemSettings = (callback: (settings: any) => void) => {
  const path = 'system/settings';
  return onSnapshot(doc(db, 'system', 'settings'), (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    } else {
      // Default settings if none exist
      const defaults = {
        prices: {
          basicMessage: 4,
          vipMessage: 2,
          imageMessage: 5,
          unlockImage: 5
        },
        vipBenefits: {
          freeMessagesPerDay: 5
        }
      };
      callback(defaults);
    }
  });
};

export const updateSystemSettings = async (data: any) => {
  const path = 'system/settings';
  try {
    await setDoc(doc(db, 'system', 'settings'), data, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};
