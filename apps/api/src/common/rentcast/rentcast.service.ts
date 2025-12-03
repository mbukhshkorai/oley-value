import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import axios from 'axios';

export interface RentcastValuationRequest {
  address: string;
  beds?: number;
  baths?: number;
  sqft?: number;
}

export interface RentcastValuationResponse {
  estimate: number;
  range: {
    low: number;
    high: number;
  };
  confidence: number;
  comparables: Array<{
    address: string;
    price: number;
    beds: number;
    baths: number;
    sqft: number;
    distance: number;
    correlation: number;
  }>;
}

@Injectable()
export class RentcastService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.rentcast.io/v1';

  constructor(
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.apiKey = this.configService.get<string>('RENTCAST_API_KEY');
  }

  async getPropertyValuation(
    request: RentcastValuationRequest,
  ): Promise<RentcastValuationResponse> {
    // Create cache key
    const cacheKey = `rentcast:${request.address}:${request.beds || ''}:${request.baths || ''}:${request.sqft || ''}`;

    // Check cache first (24 hour cache)
    const cached = await this.cacheManager.get<RentcastValuationResponse>(cacheKey);
    if (cached) {
      console.log('Returning cached Rentcast data');
      return cached;
    }

    try {
      // Call Rentcast API
      const response = await axios.get(`${this.baseUrl}/value-estimate`, {
        params: {
          address: request.address,
          beds: request.beds,
          baths: request.baths,
          sqft: request.sqft,
        },
        headers: {
          'X-Api-Key': this.apiKey,
        },
        timeout: 15000, // 15 second timeout
      });

      const data = response.data;

      // Transform response to our format
      const result: RentcastValuationResponse = {
        estimate: data.price || data.estimate || 0,
        range: {
          low: data.priceRangeLow || data.rangeLow || data.estimate * 0.9,
          high: data.priceRangeHigh || data.rangeHigh || data.estimate * 1.1,
        },
        confidence: data.confidence || 0.85,
        comparables: (data.comparables || []).slice(0, 10).map((comp: any) => ({
          address: comp.address || '',
          price: comp.price || 0,
          beds: comp.bedrooms || comp.beds || 0,
          baths: comp.bathrooms || comp.baths || 0,
          sqft: comp.squareFeet || comp.sqft || 0,
          distance: comp.distance || 0,
          correlation: comp.correlation || 0.9,
        })),
      };

      // Cache for 24 hours
      await this.cacheManager.set(cacheKey, result, 86400000);

      return result;
    } catch (error) {
      console.error('Rentcast API Error:', error.message);

      // If API is down, return error
      if (error.response) {
        throw new HttpException(
          'Property valuation service temporarily unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      throw new HttpException(
        'Failed to retrieve property valuation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateAddress(address: string): Promise<boolean> {
    try {
      // Simple validation - just check if we can get data
      await this.getPropertyValuation({ address });
      return true;
    } catch {
      return false;
    }
  }
}
