'use client';
import { useFiles } from '@/components/providers/FilesProvider';
import bytes from 'bytes';
import { format as dateFormat } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { FaDownload, FaEdit, FaSave, FaTrash } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';
import { ObjFile, downloadFile } from '../api/functions';
import Image from 'next/image';
import { transformFile } from '../api/functions';

export default function HomePage(): JSX.Element {
  const [editedFile, setEditedFile] = useState<ObjFile | null>(null);
  const editedFileInputRef = React.useRef<HTMLInputElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    state: {
      actions: {
        delete: { mutating: beingDeletedItems },
        rename: { mutating: beingRenamedItems },
        upload: { loading: uploading },
      },
      files,
    },
    deleteFile,
    listFiles,
    renameFile,
    uploadFile,
  } = useFiles();

  const handleDelete = (id: string) => async () => deleteFile(id);

  const isNothingBeingRenamed = Object.keys(beingRenamedItems).length === 0;

  const handleChangeFilename = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNothingBeingRenamed && editedFile) {
      const file = { ...editedFile!, name: e.target.value };
      setEditedFile(file);
    }
  };

  const handleSaveFile = async () => {
    if (editedFile) {
      await renameFile(editedFile.id, editedFile.name);
      setEditedFile(null);
    }
  };

  const handleUploadClick = () => fileInputRef.current?.click();
  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();
    const file = e.target.files![0];
    formData.append('file', file);
    await uploadFile(formData);
  };

  const handleStartEdit = (file: ObjFile) => () => {
    if (isNothingBeingRenamed && (!editedFile || file.id !== editedFile.id)) {
      setEditedFile(file);
    }
  };

  const handleStopEdit = () => {
    if (isNothingBeingRenamed) {
      setEditedFile(null);
    }
  };

  const handleDownloadFile = (id: string) => () => downloadFile(id);
  const handleTransformFile = (id: string) => () => transformFile(id, { x: 2, y: 2, z: 2 }, { x: 0, y: 0, z: 0 });

  useEffect(() => {
    listFiles();
  }, [listFiles]);

  useEffect(() => {
    if (editedFile && editedFileInputRef.current) {
      editedFileInputRef.current.focus();
    }
  }, [editedFile]);

  return (
    <div className="card w-full shadow-xl">
      <figure>
        <Image alt="Bowser" src="/bowser.png" priority height={334} width={768} />
      </figure>

      <div className="card-body">
        <div className="card-actions justify-end">
          <input accept=".obj" className="hidden" ref={fileInputRef} onChange={handleUploadFile} type="file" />
          <button className={twMerge('btn-primary btn w-32', uploading && 'loading')} onClick={handleUploadClick}>
            {!uploading ? 'Upload' : ''}
          </button>
        </div>
        <h2 className="card-title text-accent">Files</h2>
        <div className="flex items-center text-sm font-semibold">
          <span className="flex-1 text-left">Filename</span>
          <span>Upload Date</span>
          <span className="w-32">File Size</span>
          <span className="w-24" />
          <span className="w-24" />
        </div>

        {files?.map((file, index) => {
          const isEditedFile = editedFile && editedFile.id === file.id;
          let hasChanged = false;

          if (isEditedFile) {
            hasChanged = editedFile.name !== file.name;
          }

          const isBeingDeleted = beingDeletedItems[file.id] === true;
          const isBeingRenamed = beingRenamedItems[file.id] === true;

          return (
            <React.Fragment key={file.id}>
              <div className="flex items-center text-sm">
                {isEditedFile ? (
                  <>
                    <input
                      className="input-bordered input-primary input input-sm -ml-[13px]"
                      onChange={handleChangeFilename}
                      ref={editedFileInputRef}
                      type="text"
                      value={editedFile.name}
                    />
                    <button
                      className={twMerge('btn-success btn-square btn-sm btn ml-2', isBeingRenamed && 'loading')}
                      disabled={!isBeingRenamed && !hasChanged}
                      onClick={handleSaveFile}
                    >
                      {!isBeingRenamed && <FaSave />}
                    </button>
                    <button className="btn-outline btn-error btn-square btn-sm btn ml-1 mr-4" onClick={handleStopEdit}>
                      <MdClose className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <span className="flex-1 text-left">{file.name}</span>
                )}

                <span className="text-gray-500">{dateFormat(new Date(file.creation_date), 'yyyy-MM-dd hh:mm aa')}</span>
                <span className="w-32 text-gray-500">{bytes(file.size)}</span>
                <a className="link-primary link w-24" onClick={handleTransformFile(file.id)}>
                  Transform x2
                </a>

                <div className="flex w-24 items-center justify-end">
                  <button
                    className="btn-ghost btn-square btn-sm btn hover:bg-info hover:text-info-content"
                    onClick={handleDownloadFile(file.id)}
                  >
                    <FaDownload />
                  </button>
                  <button
                    className="btn-ghost btn-square btn-sm btn hover:bg-warning hover:text-warning-content"
                    onClick={handleStartEdit(file)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className={twMerge(
                      'btn-ghost btn-square btn-sm btn text-error hover:bg-error hover:text-error-content',
                      isBeingDeleted && 'loading',
                    )}
                    onClick={handleDelete(file.id)}
                  >
                    {!isBeingDeleted && <FaTrash />}
                  </button>
                </div>
              </div>
              {index < files.length - 1 && <div className="divider my-0" />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
