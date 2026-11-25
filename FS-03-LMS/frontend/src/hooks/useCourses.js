import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);

  const fetchCourses = useCallback(async (params = {}) => {
    setIsLoading(true);
    try {
      const r = await api.get('/courses', { params: { ...filters, ...params } });
      setCourses(r.data.data || []);
      if (r.data.pagination) setPagination(r.data.pagination);
      return r.data.data;
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const fetchFeaturedCourses = useCallback(async (limit = 8) => {
    const r = await api.get('/courses/featured', { params: { limit } });
    setFeaturedCourses(r.data.data || []);
    return r.data.data;
  }, []);

  const fetchCategories = useCallback(async () => {
    const r = await api.get('/categories');
    setCategories(r.data.data || []);
    return r.data.data;
  }, []);

  const fetchBrands = useCallback(async () => {
    const r = await api.get('/brands');
    setBrands(r.data.data || []);
    return r.data.data;
  }, []);

  const fetchCourseBySlug = useCallback(async (slug) => {
    const r = await api.get(`/courses/${slug}`);
    setCurrentCourse(r.data.data);
    return r.data.data;
  }, []);

  const fetchRelated = useCallback(async (id, category, limit = 4) => {
    const r = await api.get(`/courses/related/${id}`, { params: { category, limit } });
    return r.data.data;
  }, []);

  return {
    courses, featuredCourses, categories, brands, pagination, filters, isLoading, currentCourse,
    setFilters, fetchCourses, fetchFeaturedCourses, fetchCategories, fetchBrands, fetchCourseBySlug, fetchRelated,
  };
}

export default useCourses;