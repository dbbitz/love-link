import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  type DocumentData,
} from "firebase/firestore";

import type { CreationDraft, PresentationRecord } from "@/features/creation/types";
import { db } from "@/shared/firebase/firebase";

export interface CreatedPresentation {
  presentationId: string;
  shareLink: string;
}

export async function createPresentation(
  userId: string,
  draft: CreationDraft
): Promise<CreatedPresentation> {
  console.log(userId, draft);
  const presentationsRef = collection(db, "users", userId, "presentations");
  console.log('presentationsRef', presentationsRef);
  const presentationRef = doc(presentationsRef);

  console.log('presentationRef', presentationRef)

  const payload: DocumentData = {
    ...draft,
    ownerUid: userId,
    status: "published",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(presentationRef, payload);

  const shareLink = `${window.location.origin}/present/${userId}/${presentationRef.id}`;

  return {
    presentationId: presentationRef.id,
    shareLink,
  };
}

export async function getPresentationById(
  userId: string,
  presentationId: string
): Promise<PresentationRecord | null> {
  const presentationRef = doc(db, "users", userId, "presentations", presentationId);
  const snapshot = await getDoc(presentationRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  return {
    id: snapshot.id,
    ownerUid: data.ownerUid ?? "",
    status: data.status ?? "published",
    items: data.items ?? [],
    selectedGiftCard: data.selectedGiftCard ?? null,
    selectedAudio: data.selectedAudio ?? null,
    selectedThemeId: data.selectedThemeId ?? "romantic-hearts",
  } as PresentationRecord;
}
