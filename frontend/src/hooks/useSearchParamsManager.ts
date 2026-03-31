import { useOptimisticSearchParams } from "nuqs/adapters/react-router/v7";
import { useSearchParams } from "react-router";
import { useCallback } from "react";

export function useSearchParamsManager(exclude: string[] = []) {
  const searchParams = useOptimisticSearchParams();
  const [, setSearchParams] = useSearchParams();

  const getAll = useCallback(
    (exclude: string[] = []): Record<string, string | string[]> => {
      const result: Record<string, string | string[]> = {};
      const keys = new Set(searchParams.keys());

      for (const key of keys) {
        if (exclude.includes(key)) continue;
        const values = searchParams.getAll(key);
        result[key] = values.length > 1 ? values : values[0];
      }
      return result;
    },
    [searchParams],
  );

  const params = getAll(exclude);

  const get = useCallback(
    (key: string): string | null => {
      return searchParams.get(key);
    },
    [searchParams],
  );

  const set = useCallback(
    (key: string, value: string) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.set(key, value);
        return params;
      });
    },
    [setSearchParams],
  );

  const remove = useCallback(
    (key: string) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.delete(key);
        return params;
      });
    },
    [setSearchParams],
  );

  const clear = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  const clearPagination = useCallback(() => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete("page");
      params.delete("offset");
      params.delete("limit");
      return params;
    });
  }, [setSearchParams]);

  return { getAll, get, set, remove, clear, params, clearPagination };
}
