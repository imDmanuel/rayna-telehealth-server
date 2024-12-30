export const getPagination = (page: number, limit: number) => {
  const skip =
    !isNaN(page) && !isNaN(limit) ? Math.abs((page - 1) * limit) : undefined;
  const take = limit ? limit : undefined;

  return {
    offset: skip,
    limit: take,
  };
};
