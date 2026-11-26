import { useState, useCallback, useRef } from 'react';
import api from '../utils/api';

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [filters, setFiltersState] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [error, setError] = useState(null);

  const filtersRef = useRef(filters);

  const setFilters = useCallback((updater) => {
    const prev = filtersRef.current || {};
    const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
    filtersRef.current = next;
    setFiltersState(next);
  }, []);

  const clearFilters = useCallback(() => {
    filtersRef.current = {};
    setFiltersState({});
  }, []);

  const fetchCourses = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const r = await api.get('/courses', { params: { ...filtersRef.current, ...params } });
      const list = r.data.data || [];
      setCourses(list);
      if (r.data.pagination) setPagination(r.data.pagination);
      return list;
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load courses');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchFeaturedCourses = useCallback(async (limit = 8) => {
    try {
      const r = await api.get('/courses/featured', { params: { limit } });
      const list = r.data.data || [];
      setFeaturedCourses(list);
      return list;
    } catch (e) {
      setFeaturedCourses([]);
      return [];
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const r = await api.get('/categories');
      const list = r.data.data || [];
      setCategories(list);
      return list;
    } catch (e) {
      setCategories([]);
      return [];
    }
  }, []);

  const fetchBrands = useCallback(async () => {
    try {
      const r = await api.get('/brands');
      const list = r.data.data || [];
      setBrands(list);
      return list;
    } catch (e) {
      setBrands([]);
      return [];
    }
  }, []);

  const fetchCourseBySlug = useCallback(async (slug) => {
    setIsLoading(true);
    setError(null);
    try {
      const r = await api.get(`/courses/${slug}`);
      setCurrentCourse(r.data.data);
      return r.data.data;
    } catch (e) {
      setCurrentCourse(null);
      setError(e.response?.data?.message || 'Course not found');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCurrentCourse = useCallback(() => {
    setCurrentCourse(null);
    setRelatedCourses([]);
  }, []);

  const fetchRelated = useCallback(async (id, category, limit = 4) => {
    if (!id) return [];
    try {
      const r = await api.get(`/courses/related/${id}`, { params: { category, limit } });
      const list = r.data.data || [];
      setRelatedCourses(list);
      return list;
    } catch (e) {
      setRelatedCourses([]);
      return [];
    }
  }, []);

  return {
    courses,
    products: courses,
    featuredCourses,
    featuredProducts: featuredCourses,
    relatedCourses,
    relatedProducts: relatedCourses,
    categories,
    brands,
    pagination,
    filters,
    isLoading,
    error,
    currentCourse,
    currentProduct: currentCourse,
    setFilters,
    clearFilters,
    fetchCourses,
    fetchProducts: fetchCourses,
    fetchFeaturedCourses,
    fetchFeaturedProducts: fetchFeaturedCourses,
    fetchCategories,
    fetchBrands,
    fetchCourseBySlug,
    fetchProductBySlug: fetchCourseBySlug,
    clearCurrentCourse,
    clearCurrentProduct: clearCurrentCourse,
    fetchRelated,
  };
}

export default useCourses;
