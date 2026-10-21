"use client";

import { useEffect, useState } from "react";

export interface PageSectionItem {
  title?: string;
  desc?: string;
  icon?: string;
  number?: string;
  label?: string;
  name?: string;
  role?: string;
  quote?: string;
  rating?: number;
  avatar?: string;
  image?: string;
  bio?: string;
  [key: string]: any;
}

export interface PageSection {
  id: string;
  name: string;
  type: string;
  badge?: string;
  title: string;
  subtitle?: string;
  button_text?: string;
  button_link?: string;
  secondary_button_text?: string;
  secondary_button_link?: string;
  image?: string;
  rating_value?: string;
  rating_label?: string;
  visible?: boolean;
  order?: number;
  phone1?: string;
  phone2?: string;
  email?: string;
  address?: string;
  hours?: string;
  map_query?: string;
  items?: PageSectionItem[];
  [key: string]: any;
}

export interface DynamicPageData {
  id?: number;
  title?: string;
  slug?: string;
  meta_title?: string;
  meta_description?: string;
  status?: string;
  sections: PageSection[];
}

const CACHE_PREFIX = "entec_page_cache_";

export function useDynamicPage(slug: string, defaultSections: PageSection[] = []) {
  const [sections, setSections] = useState<PageSection[]>(defaultSections);
  const [isDynamic, setIsDynamic] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // 1. Try instantaneous load from localStorage cache if available
    try {
      const cached = localStorage.getItem(`${CACHE_PREFIX}${slug}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSections(parsed);
          setIsDynamic(true);
        }
      }
    } catch {
      // LocalStorage unavailable, proceed with network
    }

    // 2. Fetch fresh page data from API
    async function fetchFreshPage() {
      try {
        const res = await fetch(`/api/pages.php?slug=${encodeURIComponent(slug)}`, {
          cache: "no-store",
          headers: { "Accept": "application/json" }
        });

        if (!res.ok) return;

        const data = await res.json();
        if (data && data.success && data.page && Array.isArray(data.page.sections)) {
          if (isMounted) {
            setSections(data.page.sections);
            setIsDynamic(true);
            try {
              localStorage.setItem(`${CACHE_PREFIX}${slug}`, JSON.stringify(data.page.sections));
            } catch {
              // Ignore cache write error
            }
          }
        }
      } catch (err) {
        // Fallback gracefully to default sections
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchFreshPage();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  /**
   * Helper to retrieve a section by ID or Type
   * Automatically verifies if section is marked visible (defaults to true)
   */
  const getSection = (idOrType: string): PageSection | undefined => {
    return sections.find(
      (s) => (s.id === idOrType || s.type === idOrType) && s.visible !== false
    );
  };

  /**
   * Returns all custom / newly added sections that don't match built-in IDs
   */
  const getCustomSections = (knownIds: string[] = []): PageSection[] => {
    return sections.filter(
      (s) => !knownIds.includes(s.id) && s.visible !== false
    );
  };

  return {
    sections,
    getSection,
    getCustomSections,
    isDynamic,
    loading
  };
}
