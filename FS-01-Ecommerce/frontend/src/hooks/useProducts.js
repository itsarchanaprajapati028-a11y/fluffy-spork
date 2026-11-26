import { useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, fetchProduct, fetchProductBySlug, fetchRelatedProducts, fetchFeaturedProducts, fetchCategories, fetchBrands, createProduct, updateProduct, deleteProduct, fetchVendorProducts, setFilters, clearFilters, setCurrentProduct, clearCurrentProduct } from '../slices/productSlice';

export const useProducts = () => {
  const dispatch = useDispatch();
  const { products, currentProduct, relatedProducts, featuredProducts, categories, brands, vendorProducts, pagination, vendorPagination, filters, isLoading, isCreating, isUpdating, isDeleting, error } = useSelector(state => state.product);
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const handleFetchProducts = useCallback(async (params = {}) => {
    const mergedParams = { ...filtersRef.current, ...params };
    const result = await dispatch(fetchProducts(mergedParams));
    return fetchProducts.fulfilled.match(result) ? result.payload : null;
  }, [dispatch]);

  const handleFetchProduct = useCallback(async (id) => {
    const result = await dispatch(fetchProduct(id));
    return fetchProduct.fulfilled.match(result) ? result.payload : null;
  }, [dispatch]);

  const handleFetchProductBySlug = useCallback(async (slug) => {
    const result = await dispatch(fetchProductBySlug(slug));
    return fetchProductBySlug.fulfilled.match(result) ? result.payload : null;
  }, [dispatch]);

  const handleFetchRelated = useCallback(async (id, category, limit = 4) => {
    if (!id) return null;
    const result = await dispatch(fetchRelatedProducts({ id, limit }));
    return fetchRelatedProducts.fulfilled.match(result) ? result.payload : null;
  }, [dispatch]);

  const handleFetchFeaturedProducts = useCallback(async (limit = 10) => {
    const result = await dispatch(fetchFeaturedProducts(limit));
    return fetchFeaturedProducts.fulfilled.match(result) ? result.payload : null;
  }, [dispatch]);

  const handleFetchCategories = useCallback(async () => {
    const result = await dispatch(fetchCategories());
    return fetchCategories.fulfilled.match(result) ? result.payload : null;
  }, [dispatch]);

  const handleFetchBrands = useCallback(async (category) => {
    const result = await dispatch(fetchBrands(category));
    return fetchBrands.fulfilled.match(result) ? result.payload : null;
  }, [dispatch]);

  const handleCreateProduct = useCallback(async (formData) => {
    const result = await dispatch(createProduct(formData));
    return createProduct.fulfilled.match(result) ? { success: true, product: result.payload } : { success: false, error: result.payload };
  }, [dispatch]);

  const handleUpdateProduct = useCallback(async (id, formData) => {
    const result = await dispatch(updateProduct({ id, formData }));
    return updateProduct.fulfilled.match(result) ? { success: true, product: result.payload } : { success: false, error: result.payload };
  }, [dispatch]);

  const handleDeleteProduct = useCallback(async (id) => {
    const result = await dispatch(deleteProduct(id));
    return deleteProduct.fulfilled.match(result) ? { success: true } : { success: false, error: result.payload };
  }, [dispatch]);

  const handleFetchVendorProducts = useCallback(async (params = {}) => {
    const result = await dispatch(fetchVendorProducts(params));
    return fetchVendorProducts.fulfilled.match(result) ? result.payload : null;
  }, [dispatch]);

  const handleSetFilters = useCallback((newFilters) => { dispatch(setFilters(newFilters)); }, [dispatch]);
  const handleClearFilters = useCallback(() => { dispatch(clearFilters()); }, [dispatch]);
  const handleSetCurrentProduct = useCallback((product) => { dispatch(setCurrentProduct(product)); }, [dispatch]);
  const handleClearCurrentProduct = useCallback(() => { dispatch(clearCurrentProduct()); }, [dispatch]);

  return {
    products, currentProduct, relatedProducts, featuredProducts, categories, brands, vendorProducts, pagination, vendorPagination, filters, isLoading, isCreating, isUpdating, isDeleting, error,
    fetchProducts: handleFetchProducts,
    fetchProduct: handleFetchProduct,
    fetchProductBySlug: handleFetchProductBySlug,
    fetchRelated: handleFetchRelated,
    fetchFeaturedProducts: handleFetchFeaturedProducts,
    fetchCategories: handleFetchCategories,
    fetchBrands: handleFetchBrands,
    createProduct: handleCreateProduct,
    updateProduct: handleUpdateProduct,
    deleteProduct: handleDeleteProduct,
    fetchVendorProducts: handleFetchVendorProducts,
    setFilters: handleSetFilters,
    clearFilters: handleClearFilters,
    setCurrentProduct: handleSetCurrentProduct,
    clearCurrentProduct: handleClearCurrentProduct,
  };
};

export default useProducts;