"use client";

import { useState, type ChangeEvent } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import SearchBox from "@/components/SearchBox/SearchBox";
import Paginate from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import NoteForm from "@/components/NoteForm/NoteForm";
import Modal from "@/components/Modal/Modal";

import { fetchNotes } from "@/lib/api";
import type { Note } from "@/lib/types";

import css from "./NotesPage.module.css";

type NotesResponse = {
  notes: Note[];
  totalPages: number;
};

export default function NotesClient() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { data, isLoading, isError, isSuccess } = useQuery<NotesResponse>({
    queryKey: ["notes", { page, query }],
    // ВАЖЛИВО: page (number) першим, query (string) другим
    queryFn: () => fetchNotes(page, query),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleSearchChange = useDebouncedCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      setPage(1);
    },
    250,
  );

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox query={handleSearchChange} />

        {totalPages > 1 && (
          <Paginate
            totalPages={totalPages}
            currentPage={page}
            setPage={setPage}
          />
        )}

        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {isLoading && <div className={css.statusBox}>Loading notes...</div>}

      {isError && (
        <div className={css.statusBoxError}>
          Something went wrong! Try again
        </div>
      )}

      {isSuccess && notes.length > 0 && <NoteList notes={notes} />}

      {isSuccess && notes.length === 0 && (
        <div className={css.statusBox}>
          No notes yet. Create your first note ✨
        </div>
      )}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}
