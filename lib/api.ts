import axios from "axios";
import type { Note } from "@/types/note";

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const NEXT_PUBLIC_NOTEHUB_TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

axios.defaults.baseURL = "https://notehub-public.goit.study/api";

if (!NEXT_PUBLIC_NOTEHUB_TOKEN) {
  console.warn("NEXT_PUBLIC_NOTEHUB_TOKEN is not set");
}

export async function fetchNotes(page: number, onQuery: string) {
  const response = await axios.get<FetchNotesResponse>("/notes", {
    headers: {
      Authorization: `Bearer ${NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
    params: {
      search: onQuery,
      page,
      perPage: 12,
    },
  });

  return response.data;
}

export async function fetchNoteId(id: string): Promise<Note> {
  const response = await axios.get<Note>(`/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });

  return response.data;
}

export type CreateNotePayload = {
  title: string;
  tag: string;
  content: string;
};

export async function createNote(note: CreateNotePayload): Promise<Note> {
  const response = await axios.post<Note>("/notes", note, {
    headers: {
      Authorization: `Bearer ${NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await axios.delete<Note>(`/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });

  return response.data;
}
