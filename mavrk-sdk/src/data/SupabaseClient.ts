/**
 * Supabase data layer for token metadata
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Token, TokenMetadata } from '../types';

export class TokenDataManager {
  private supabase: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Save token metadata to Supabase
   */
  async saveToken(
    contractAddress: string,
    name: string,
    symbol: string,
    metadata: TokenMetadata,
    deployerAddress: string,
    poolManagerTier: number
  ): Promise<boolean> {
    try {
      console.log('💾 Saving token metadata to Supabase...');

      // Upload logo if provided
      let logoUrl: string | null = null;
      if (metadata.logoBase64) {
        logoUrl = await this.uploadImage(
          metadata.logoBase64,
          `${contractAddress}-logo.png`,
          'token-logos'
        );
      }

      // Upload cover photo if provided
      let coverPhotoUrl: string | null = null;
      if (metadata.coverPhotoBase64) {
        coverPhotoUrl = await this.uploadImage(
          metadata.coverPhotoBase64,
          `${contractAddress}-cover.png`,
          'token-covers'
        );
      }

      // Prepare token record
      const tokenRecord = {
        name,
        symbol,
        description: metadata.description || null,
        website: metadata.website || null,
        twitter: metadata.twitter || null,
        telegram: metadata.telegram || null,
        discord: metadata.discord || null,
        category: metadata.category,
        logo_url: logoUrl,
        cover_photo_url: coverPhotoUrl,
        contract_address: contractAddress.toLowerCase(),
        network: 'ink',
        deployer_address: deployerAddress.toLowerCase(),
        pool_manager_tier: poolManagerTier,
      };

      // Insert into database
      const { error } = await this.supabase
        .from('tokens')
        .insert([tokenRecord]);

      if (error) {
        console.error('❌ Supabase insert error:', error);
        throw error;
      }

      console.log('✅ Token metadata saved successfully!');
      return true;
    } catch (error: any) {
      console.error('Failed to save token:', error);
      throw new Error(`Failed to save token metadata: ${error.message}`);
    }
  }

  /**
   * Upload base64 image to Supabase Storage
   */
  private async uploadImage(
    base64Data: string,
    fileName: string,
    bucket: string
  ): Promise<string | null> {
    try {
      // Remove data URL prefix if present
      const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, '');
      
      // Convert to buffer
      const buffer = Buffer.from(base64Clean, 'base64');

      // Upload to storage
      const { error } = await this.supabase.storage
        .from(bucket)
        .upload(fileName, buffer, {
          contentType: 'image/png',
          upsert: true,
        });

      if (error) {
        console.error(`Failed to upload ${fileName}:`, error);
        return null;
      }

      // Get public URL
      const { data } = this.supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      return null;
    }
  }

  /**
   * Get token by contract address
   */
  async getToken(address: string): Promise<Token> {
    const { data, error } = await this.supabase
      .from('tokens')
      .select('*')
      .eq('contract_address', address.toLowerCase())
      .single();

    if (error) {
      throw new Error(`Token not found: ${error.message}`);
    }

    return data as Token;
  }

  /**
   * Get all tokens
   */
  async getAllTokens(limit: number = 100): Promise<Token[]> {
    const { data, error } = await this.supabase
      .from('tokens')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch tokens: ${error.message}`);
    }

    return data as Token[];
  }

  /**
   * Search tokens by name or symbol
   */
  async searchTokens(query: string): Promise<Token[]> {
    const { data, error } = await this.supabase
      .from('tokens')
      .select('*')
      .or(`name.ilike.%${query}%,symbol.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Search failed: ${error.message}`);
    }

    return data as Token[];
  }

  /**
   * Get tokens by deployer
   */
  async getTokensByDeployer(deployerAddress: string): Promise<Token[]> {
    const { data, error } = await this.supabase
      .from('tokens')
      .select('*')
      .eq('deployer_address', deployerAddress.toLowerCase())
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch deployer tokens: ${error.message}`);
    }

    return data as Token[];
  }

  /**
   * Get tokens by category
   */
  async getTokensByCategory(category: string): Promise<Token[]> {
    const { data, error } = await this.supabase
      .from('tokens')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch category tokens: ${error.message}`);
    }

    return data as Token[];
  }
}

