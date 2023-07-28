"use client";

export default function NotepadEditor({ params, }: { params: { notepadId: string } }) {
  return (
    <main>{params.notepadId}</main>
  )
}