'use client';
import * as api from '@/api/functions';
import { ObjFile } from '@/api/functions';
import React, { createContext, useCallback, useContext } from 'react';
import useMiddlewaredReducer from '../hooks/useMiddlewaredReducer';
import Logger from './middlewares/logger';

type Action =
  | { type: 'files/delete/fulfilled'; payload: ObjFile['id'] }
  | { type: 'files/delete/pending'; payload: ObjFile['id'] }
  | { type: 'files/delete/rejected'; error: Error; id: ObjFile['id'] }
  | { type: 'files/get/fulfilled'; payload: ObjFile }
  | { type: 'files/get/pending'; payload: ObjFile['id'] }
  | { type: 'files/get/rejected'; error: Error; id: ObjFile['id'] }
  | { type: 'files/list/fulfilled'; payload: ObjFile[] }
  | { type: 'files/list/pending' }
  | { type: 'files/list/rejected'; error: Error }
  | { type: 'files/rename/fulfilled'; payload: ObjFile }
  | { type: 'files/rename/pending'; payload: ObjFile['id'] }
  | { type: 'files/rename/rejected'; error: Error; id: ObjFile['id'] }
  | { type: 'files/upload/fulfilled'; payload: ObjFile }
  | { type: 'files/upload/pending' }
  | { type: 'files/upload/rejected'; error: Error };

type State = {
  actions: {
    delete: {
      error: Error | null;
      loading: boolean;
      mutating: Record<ObjFile['id'], true>;
    };
    get: {
      error: Error | null;
      loading: boolean;
      mutating: Record<ObjFile['id'], true>;
    };
    list: {
      error: Error | null;
      loading: boolean;
    };
    rename: {
      error: Error | null;
      loading: boolean;
      mutating: Record<ObjFile['id'], true>;
    };
    upload: {
      error: Error | null;
      loading: boolean;
    };
  };
  files: ObjFile[];
};

const initialState: State = Object.freeze<State>({
  actions: {
    delete: {
      error: null,
      loading: false,
      mutating: {},
    },
    get: {
      error: null,
      loading: false,
      mutating: {},
    },
    list: {
      error: null,
      loading: false,
    },
    rename: {
      error: null,
      loading: false,
      mutating: {},
    },
    upload: {
      error: null,
      loading: false,
    },
  },
  files: [],
});

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'files/delete/pending': {
      return {
        ...state,
        actions: {
          ...state.actions,
          delete: {
            error: null,
            loading: true,
            mutating: {
              ...state.actions.delete.mutating,
              [action.payload]: true,
            },
          },
        },
      };
    }
    case 'files/delete/rejected': {
      const mutating = { ...state.actions.delete.mutating };
      delete mutating[action.id];
      return {
        ...state,
        actions: {
          ...state.actions,
          delete: {
            error: action.error,
            loading: false,
            mutating,
          },
        },
      };
    }
    case 'files/delete/fulfilled': {
      const mutating = { ...state.actions.delete.mutating };
      delete mutating[action.payload];
      return {
        ...state,
        actions: {
          ...state.actions,
          delete: {
            error: null,
            loading: false,
            mutating,
          },
        },
        files: state.files.filter(f => f.id !== action.payload),
      };
    }

    case 'files/get/pending': {
      return {
        ...state,
        actions: {
          ...state.actions,
          get: {
            error: null,
            loading: true,
            mutating: {
              ...state.actions.get.mutating,
              [action.payload]: true,
            },
          },
        },
      };
    }
    case 'files/get/rejected': {
      const mutating = { ...state.actions.get.mutating };
      delete mutating[action.id];
      return {
        ...state,
        actions: {
          ...state.actions,
          get: {
            error: action.error,
            loading: false,
            mutating,
          },
        },
      };
    }
    case 'files/get/fulfilled': {
      const fileIndex = state.files.findIndex(f => f.id === action.payload.id);
      const files = [...state.files];
      if (fileIndex > -1) files[fileIndex] = action.payload;
      const mutating = { ...state.actions.get.mutating };
      delete mutating[action.payload.id];
      return {
        ...state,
        actions: {
          ...state.actions,
          get: {
            error: null,
            loading: false,
            mutating,
          },
        },
        files,
      };
    }

    case 'files/list/pending': {
      return {
        ...state,
        actions: {
          ...state.actions,
          list: {
            error: null,
            loading: true,
          },
        },
      };
    }
    case 'files/list/rejected': {
      return {
        ...state,
        actions: {
          ...state.actions,
          list: {
            error: action.error,
            loading: false,
          },
        },
      };
    }
    case 'files/list/fulfilled': {
      return {
        ...state,
        actions: {
          ...state.actions,
          list: {
            error: null,
            loading: false,
          },
        },
        files: [...action.payload],
      };
    }

    case 'files/rename/pending': {
      return {
        ...state,
        actions: {
          ...state.actions,
          rename: {
            error: null,
            loading: true,
            mutating: {
              ...state.actions.rename.mutating,
              [action.payload]: true,
            },
          },
        },
      };
    }
    case 'files/rename/rejected': {
      const mutating = { ...state.actions.rename.mutating };
      delete mutating[action.id];
      return {
        ...state,
        actions: {
          ...state.actions,
          rename: {
            error: action.error,
            loading: false,
            mutating,
          },
        },
      };
    }
    case 'files/rename/fulfilled': {
      const fileIndex = state.files.findIndex(f => f.id === action.payload.id);
      const files = [...state.files];
      if (fileIndex > -1) files[fileIndex] = action.payload;
      const mutating = { ...state.actions.rename.mutating };
      delete mutating[action.payload.id];
      return {
        ...state,
        actions: {
          ...state.actions,
          rename: {
            error: null,
            loading: false,
            mutating,
          },
        },
        files,
      };
    }

    case 'files/upload/pending': {
      return {
        ...state,
        actions: {
          ...state.actions,
          upload: {
            error: null,
            loading: true,
          },
        },
      };
    }
    case 'files/upload/rejected': {
      return {
        ...state,
        actions: {
          ...state.actions,
          upload: {
            error: action.error,
            loading: false,
          },
        },
      };
    }
    case 'files/upload/fulfilled': {
      const files = [...state.files];
      files.push(action.payload);
      files.sort((a, b) => a.name.localeCompare(b.name));
      return {
        ...state,
        actions: {
          ...state.actions,
          upload: {
            error: null,
            loading: false,
          },
        },
        files,
      };
    }
  }
}

type Context = {
  state: State;
  deleteFile(id: ObjFile['id']): Promise<void>;
  getFile(id: ObjFile['id']): Promise<void>;
  listFiles(): Promise<void>;
  renameFile(id: ObjFile['id'], newName: ObjFile['name']): Promise<void>;
  uploadFile(file: FormData): Promise<void>;
};

const FilesContext = createContext<Context>({
  state: initialState,
  deleteFile: () => Promise.resolve(),
  getFile: () => Promise.resolve(),
  listFiles: () => Promise.resolve(),
  renameFile: () => Promise.resolve(),
  uploadFile: () => Promise.resolve(),
});

function FilesProvider({ children }: FilesProviderProps): JSX.Element {
  const [state, dispatch] = useMiddlewaredReducer(reducer, initialState, [Logger()]);

  const deleteFile: Context['deleteFile'] = useCallback(
    async id => {
      try {
        dispatch({ type: 'files/delete/pending', payload: id });
        await api.deleteFile(id);
        dispatch({ type: 'files/delete/fulfilled', payload: id });
      } catch (err) {
        dispatch({ type: 'files/delete/rejected', error: err, id });
      }
    },
    [dispatch],
  );

  const listFiles: Context['listFiles'] = useCallback(async () => {
    try {
      dispatch({ type: 'files/list/pending' });
      const files = await api.listFiles();
      dispatch({ type: 'files/list/fulfilled', payload: files });
    } catch (err) {
      dispatch({ type: 'files/list/rejected', error: err });
    }
  }, [dispatch]);

  const getFile: Context['getFile'] = useCallback(
    async id => {
      try {
        dispatch({ type: 'files/get/pending', payload: id });
        const file = await api.getFile(id);
        dispatch({ type: 'files/get/fulfilled', payload: file });
      } catch (err) {
        dispatch({ type: 'files/get/rejected', error: err, id });
      }
    },
    [dispatch],
  );

  const renameFile: Context['renameFile'] = useCallback(
    async (id, newName) => {
      try {
        dispatch({ type: 'files/rename/pending', payload: id });
        const file = await api.renameFile(id, newName);
        dispatch({ type: 'files/rename/fulfilled', payload: file });
      } catch (err) {
        dispatch({ type: 'files/rename/rejected', error: err, id });
      }
    },
    [dispatch],
  );

  const uploadFile: Context['uploadFile'] = useCallback(
    async formData => {
      try {
        dispatch({ type: 'files/upload/pending' });
        const file = await api.uploadFile(formData);
        dispatch({ type: 'files/upload/fulfilled', payload: file });
      } catch (err) {
        dispatch({ type: 'files/upload/rejected', error: err });
      }
    },
    [dispatch],
  );

  return (
    <FilesContext.Provider
      value={{
        state,
        deleteFile,
        getFile,
        listFiles,
        renameFile,
        uploadFile,
      }}
    >
      {children}
    </FilesContext.Provider>
  );
}

function useFiles() {
  return useContext(FilesContext);
}

export type FilesProviderProps = {
  children: React.ReactNode;
};
export type { State };
export { FilesContext, useFiles };
export default FilesProvider;
