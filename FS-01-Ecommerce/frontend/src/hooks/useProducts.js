import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, fetchProduct, fetchProductBySlug, fetchFeaturedProducts, fetchCategories, fetchBrands, createProduct, updateProduct, deleteProduct, fetchVendorProducts, setFilters, clearFilters, setCurrentProduct, clearCurrentProduct } from '../slices/productSlice';

export const useProducts = () => {
  const dispatch = useDispatch();
  const { products, currentProduct, featuredProducts, categories, brands, vendorProducts, pagination, vendorPagination, filters, isLoading, isCreating, isUpdating, isDeleting, error } = useSelector(state => state.product);
  
  const handleFetchProducts = async (params = {}) => {
    const mergedParams = { ...filters, ...params };
    const result = await dispatch(fetchProducts(mergedParams));
    return fetchProducts.fulfilled.match(result) ? result.payload : null;
  };
  
  const handleFetchProduct = async (id) => {
    const result = await dispatch(fetchProduct(id));
    return fetchProduct.fulfilled.match(result) ? result.payload : null;
  };
  
  const handleFetchProductBySlug = async (slug) => {
    const result = await dispatch(fetchProductBySlug(slug));
    return fetchProductBySlug.fulfilled.match(result) ? result.payload : null;
  };
  
  const handleFetchFeaturedProducts = async (limit = 10) => {
    const result = await dispatch(fetchFeaturedProducts(limit));
    return fetchFeaturedProducts.fulfilled.match(result) ? result.payload : null;
  };
  
  const handleFetchCategories = async () => {
    const result = await dispatch(fetchCategories());
    return fetchCategories.fulfilled.match(result) ? result.payload : null;
  };
  
  const handleFetchBrands = async (category) => {
    const result = await dispatch(fetchBrands(category));
    return fetchBrands.fulfilled.match(result) ? result.payload : null;
  };
  
  const handleCreateProduct = async (formData) => {
    const result = await dispatch(createProduct(formData));
    return createProduct.fulfilled.match(result) ? { success: true, product: result.payload } : { success: false, error: result.payload };
  };
  
  const handleUpdateProduct = async (id, formData) => {
    const result = await dispatch(updateProduct({ id, formData }));
    return updateProduct.fulfilled.match(result) ? { success: true, product: result.payload } : { success: false, error: result.payload };
  };
  
  const handleDeleteProduct = async (id) => {
    const result = await dispatch(deleteProduct(id));
    return deleteProduct.fulfilled.match(result) ? { success: true } : { success: false, error: result.payload };
  };
  
  const handleFetchVendorProducts = async (params = {}) => {
    const result = await dispatch(fetchVendorProducts(params));
    return fetchVendorProducts.fulfilled.match(result) ? result.payload : null;
  };
  
  const handleSetFilters = (newFilters) => {
    dispatch(setFilters(newFilters));
  };
  
  const handleClearFilters = () => {
    dispatch(clearFilters());
  };
  
  const handleSetCurrentProduct = (product) => {
    dispatch(setCurrentProduct(product));
  };
  
  const handleClearCurrentProduct = () => {
    dispatch(clearCurrentProduct());
  };
  
  return {
    products,
    currentProduct,
    featuredProducts,
    categories,
    brands,
    vendorProducts,
    pagination,
    vendorPagination,
    filters,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    fetchProducts: handleFetchProducts,
    fetchProduct: handleFetchProduct,
    fetchProductBySlug: handleFetchProductBySlug,
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