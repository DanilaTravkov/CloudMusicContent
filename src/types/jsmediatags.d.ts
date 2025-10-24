declare module 'jsmediatags' {
  interface Tags {
    title?: string;
    artist?: string;
    genre?: string;
    album?: string;
    year?: string;
    [key: string]: any;
  }

  interface TagResult {
    tags: Tags;
    [key: string]: any;
  }

  export function read(
    mediaFile: File | string,
    config: {
      onSuccess?: (tag: TagResult) => void;
      onError?: (error: any) => void;
      [key: string]: any;
    }
  ): void;

  export default {
    read,
  };
}
