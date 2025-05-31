
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VehicleData {
  id: string;
  photos: any;
  tag: string;
  vehicle_city: string;
  year: number;
  brand: string;
  model: string;
  variant: string;
  sell_price: number;
  kms_driven: number;
  color: string;
  number_of_owners: number;
}

export interface DetailedVehicleData extends VehicleData {
  fuel_type: string;
  cc: number;
  features: string;
}

export const useCarData = (filter?: 'recommended' | 'discounted' | 'all', limit?: number) => {
  const [cars, setCars] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('car_buyer_listings')
          .select('id, photos, tag, vehicle_city, year, brand, model, variant, sell_price, kms_driven, color, number_of_owners');

        if (filter === 'recommended') {
          query = query.eq('recommended', 'yes');
        } else if (filter === 'discounted') {
          query = query.eq('discounted', 'yes');
        }

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) throw error;
        setCars(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [filter, limit]);

  return { cars, loading, error };
};

export const useBikeData = (filter?: 'recommended' | 'discounted' | 'all', limit?: number) => {
  const [bikes, setBikes] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('bike_buyer_listings')
          .select('id, photos, tag, vehicle_city, year, brand, model, variant, sell_price, kms_driven, color, number_of_owners');

        if (filter === 'recommended') {
          query = query.eq('recommended', 'yes');
        } else if (filter === 'discounted') {
          query = query.eq('discounted', 'yes');
        }

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) throw error;
        setBikes(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBikes();
  }, [filter, limit]);

  return { bikes, loading, error };
};

export const useVehicleDetails = (id: string, type: 'car' | 'bike') => {
  const [vehicle, setVehicle] = useState<DetailedVehicleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        setLoading(true);
        const table = type === 'car' ? 'car_buyer_listings' : 'bike_buyer_listings';
        
        const { data, error } = await supabase
          .from(table)
          .select('id, photos, tag, vehicle_city, year, brand, model, variant, sell_price, kms_driven, color, number_of_owners, fuel_type, cc, features')
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        setVehicle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVehicleDetails();
    }
  }, [id, type]);

  return { vehicle, loading, error };
};
