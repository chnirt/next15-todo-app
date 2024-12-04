// Helper function to build URL with query parameters
export const buildUrlWithParams = (
    baseUrl: string,
    params: Record<string, string | undefined>
  ) => {
    const validParams = Object.keys(params)
      .filter((key) => params[key] !== undefined)
      .reduce(
        (acc, key) => {
          acc[key] = params[key]!;
          return acc;
        },
        {} as Record<string, string>
      );
  
    const urlParams = new URLSearchParams(validParams);
    return `${baseUrl}?${urlParams.toString()}`;
  };
  