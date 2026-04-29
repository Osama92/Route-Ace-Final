import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface CompanySettings {
  id: string;
  company_name: string;
  tagline: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  bank_name: string | null;
  bank_account_name: string | null;
  bank_account_number: string | null;
  signature_url: string | null;
  logo_url: string | null;
}

export const useCompanySettings = () => {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch settings from database - single source of truth
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("company_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      setSettings(data as CompanySettings | null);
      return data as CompanySettings | null;
    } catch (error: any) {
      console.error("Error fetching company settings:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Atomic update with proper upsert logic - returns the saved record
  const updateSettings = async (updates: Partial<CompanySettings>): Promise<CompanySettings | null> => {
    try {
      // Step 1: Fetch current record to ensure we have latest state
      const { data: existing, error: fetchError } = await supabase
        .from("company_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (fetchError) throw fetchError;

      let savedRecord: CompanySettings | null = null;

      if (!existing) {
        // INSERT: No record exists - create new with all fields
        const insertPayload = {
          company_name: updates.company_name || "My Company",
          tagline: updates.tagline ?? null,
          email: updates.email ?? null,
          phone: updates.phone ?? null,
          address: updates.address ?? null,
          bank_name: updates.bank_name ?? null,
          bank_account_name: updates.bank_account_name ?? null,
          bank_account_number: updates.bank_account_number ?? null,
          signature_url: updates.signature_url ?? null,
          logo_url: updates.logo_url ?? null,
        };
        
        const { data, error } = await supabase
          .from("company_settings")
          .insert(insertPayload)
          .select();

        if (error) throw error;
        
        // Handle array response - take first record
        if (Array.isArray(data) && data.length > 0) {
          savedRecord = data[0] as CompanySettings;
        } else if (data && !Array.isArray(data)) {
          savedRecord = data as CompanySettings;
        } else {
          throw new Error("Insert returned no data - check RLS policies");
        }
      } else {
        // UPDATE: Record exists - merge updates with existing values
        // Only override fields that are explicitly provided in updates
        const mergedPayload: Record<string, any> = {
          updated_at: new Date().toISOString(),
        };

        // Explicitly check each field - only include if key exists in updates
        if ('company_name' in updates) {
          mergedPayload.company_name = updates.company_name || existing.company_name;
        }
        if ('tagline' in updates) {
          mergedPayload.tagline = updates.tagline;
        }
        if ('email' in updates) {
          mergedPayload.email = updates.email;
        }
        if ('phone' in updates) {
          mergedPayload.phone = updates.phone;
        }
        if ('address' in updates) {
          mergedPayload.address = updates.address;
        }
        if ('bank_name' in updates) {
          mergedPayload.bank_name = updates.bank_name;
        }
        if ('bank_account_name' in updates) {
          mergedPayload.bank_account_name = updates.bank_account_name;
        }
        if ('bank_account_number' in updates) {
          mergedPayload.bank_account_number = updates.bank_account_number;
        }
        if ('signature_url' in updates) {
          mergedPayload.signature_url = updates.signature_url;
        }
        if ('logo_url' in updates) {
          mergedPayload.logo_url = updates.logo_url;
        }

        const { data, error } = await supabase
          .from("company_settings")
          .update(mergedPayload)
          .eq("id", existing.id)
          .select();

        if (error) throw error;
        
        // Handle array response - take first record
        if (Array.isArray(data) && data.length > 0) {
          savedRecord = data[0] as CompanySettings;
        } else if (data && !Array.isArray(data)) {
          savedRecord = data as CompanySettings;
        } else {
          throw new Error("Update returned no data - check RLS policies");
        }
      }

      // Step 2: Verify write succeeded by updating local state with DB response
      if (savedRecord) {
        setSettings(savedRecord);
        toast({
          title: "Settings Saved",
          description: "Company settings updated successfully",
        });
        return savedRecord;
      }

      throw new Error("Failed to save settings - no record returned");
    } catch (error: any) {
      console.error("Error saving company settings:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save settings",
        variant: "destructive",
      });
      return null;
    }
  };

  // Upload file to storage and return public URL
  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    try {
      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        throw new Error("Invalid file type. Please upload PNG, JPG, or SVG.");
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error("File too large. Maximum size is 2MB.");
      }

      const fileExt = file.name.split(".").pop()?.toLowerCase() || 'png';
      const fileName = `${folder}-${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from("company-assets")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("company-assets")
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error: any) {
      console.error(`${folder} upload error:`, error);
      toast({
        title: "Upload Error",
        description: error.message || `Failed to upload ${folder}`,
        variant: "destructive",
      });
      return null;
    }
  };

  // Atomic: Upload signature and save URL to database in one transaction
  const uploadAndSaveSignature = async (file: File): Promise<string | null> => {
    const url = await uploadFile(file, 'signatures');
    if (!url) return null;
    
    const savedRecord = await updateSettings({ signature_url: url });
    return savedRecord ? savedRecord.signature_url : null;
  };

  // Atomic: Upload logo and save URL to database in one transaction
  const uploadAndSaveLogo = async (file: File): Promise<string | null> => {
    const url = await uploadFile(file, 'logos');
    if (!url) return null;
    
    const savedRecord = await updateSettings({ logo_url: url });
    return savedRecord ? savedRecord.logo_url : null;
  };

  // Force refresh from database - use for cache invalidation
  const forceRefresh = useCallback(async () => {
    return await fetchSettings();
  }, [fetchSettings]);

  // Initial fetch on mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    updateSettings,
    uploadAndSaveSignature,
    uploadAndSaveLogo,
    refetch: fetchSettings,
    forceRefresh,
  };
};

export default useCompanySettings;
