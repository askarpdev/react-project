interface Window {
  dynamo: {
    state: {
      strands: Record<string, string | string[]>;
      vars: Record<string, any>;
      getStrands(): Array<{ name: string; value: string | string[] }>;
      getStrand(
        name: string,
      ): { name: string; value: string | string[] } | undefined;
      setStrand(name: string, value: string | string[]): boolean;
      setStrands(
        newStrands: Array<{ name: string; value: string | string[] }>,
      ): boolean;
      clearStrands(): boolean;
      removeStrand(name: string): boolean;
    };
  };
}
