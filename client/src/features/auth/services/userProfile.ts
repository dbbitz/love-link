import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import type { User } from "firebase/auth";

import { db } from "@/shared/firebase/firebase";

export async function upsertUserProfile(user: User) {
  console.log(user);
  const userRef = doc(db, "users", user.uid);
  console.log('userRef', userRef);
  const snapshot = await getDoc(userRef);
  console.log('snapshot', snapshot);
  const isNewUser = !snapshot.exists();

  await setDoc(
    userRef,
    {
      uid: user.uid,
      email: user.email ?? "",
      displayName: user.displayName ?? null,
      updatedAt: serverTimestamp(),
      ...(isNewUser ? { createdAt: serverTimestamp() } : {}),
    },
    { merge: true }
  );
}
