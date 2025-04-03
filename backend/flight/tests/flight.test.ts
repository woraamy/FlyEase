// tests/flight.test.ts
import { describe, it, expect, beforeAll, afterAll, vi, beforeEach } from 'vitest';
import { AppDataSource } from '../src/data-source';
import request from 'supertest';
import mockApp from './mockServer';
import { Flight } from '../src/entity/Flight';
import { Airport } from '../src/entity/Airport';
import { TravelClass, TravelClassType } from '../src/entity/TravelClass';
import { FlightClassDetail } from '../src/entity/FlightClassDetail';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Mock axios
vi.mock('axios');

// Increase test timeout
const TEST_TIMEOUT = 15000;

describe('Flight API Tests', () => {
  beforeAll(async () => {
    // Make sure we're using the test database
    if (!process.env.DATABASE_URL?.includes('test')) {
      console.warn('Warning: Tests are not running against a database with "test" in the name');
    }
    
    // Only initialize if not already initialized
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    await seedTestData();
  }, TEST_TIMEOUT);


  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /flights', () => {
    it('should return all available flights', async () => {
      const response = await request(mockApp).get('/flights');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('flight_number');
      expect(response.body[0]).toHaveProperty('departure_airport');
      expect(response.body[0]).toHaveProperty('arrival_airport');
    }, TEST_TIMEOUT);
  });

  describe('GET /flights/search', () => {
    it('should search flights by departure city', async () => {
      const response = await request(mockApp)
        .get('/flights/search')
        .query({ departure_airport_city: 'New York' });
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].departure_airport.city.toLowerCase()).toContain('new york');
    }, TEST_TIMEOUT);

    it('should search flights by arrival city', async () => {
      const response = await request(mockApp)
        .get('/flights/search')
        .query({ arrival_airport_city: 'London' });
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].arrival_airport.city.toLowerCase()).toContain('london');
    }, TEST_TIMEOUT);

    it('should search flights by departure date', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];
      
      const response = await request(mockApp)
        .get('/flights/search')
        .query({ departure_date: dateStr });
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    }, TEST_TIMEOUT);
  });

  describe('GET /flights/:flightId', () => {
    it('should return a flight by ID', async () => {
      // First get a flight ID
      const allFlights = await request(mockApp).get('/flights');
      const flightId = allFlights.body[0].id;
      
      const response = await request(mockApp).get(`/flights/${flightId}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', flightId);
      expect(response.body).toHaveProperty('flight_number');
      expect(response.body).toHaveProperty('departure_airport');
      expect(response.body).toHaveProperty('arrival_airport');
    }, TEST_TIMEOUT);

    it('should return 404 for non-existent flight ID', async () => {
      const response = await request(mockApp).get('/flights/99999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Flight not found');
    }, TEST_TIMEOUT);
  });

  describe('GET /flights/travel-rec/:arrivalCity', () => {
    it('should return flights by arrival city', async () => {
      const response = await request(mockApp).get('/flights/travel-rec/London');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    }, TEST_TIMEOUT);
  });

  describe('GET /flights/by-airport/:code', () => {
    it('should return flights by airport code', async () => {
      const response = await request(mockApp).get('/flights/by-airport/JFK');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    }, TEST_TIMEOUT);

    it('should return 400 for invalid airport code format', async () => {
      const response = await request(mockApp).get('/flights/by-airport/X');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Bad request');
    }, TEST_TIMEOUT);
  });

  describe('POST /flights/recommend', () => {
    it('should return recommendations based on user preferences', async () => {
      const response = await request(mockApp)
        .post('/flights/recommend')
        .send({
          wants_extra_baggage: true,
          wants_preferred_seat: true,
          wants_in_flight_meals: true,
          num_passengers: 2,
          length_of_stay: 7,
          season: 'Summer',
          trip_type: 'Regular Vacation'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('recommendations');
      expect(Array.isArray(response.body.recommendations)).toBe(true);
      expect(response.body.recommendations.length).toBeGreaterThan(0);
    }, TEST_TIMEOUT);
  });

  describe('GET /airports', () => {
    it('should return all airports', async () => {
      const response = await request(mockApp).get('/airports');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('code');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('city');
      expect(response.body[0]).toHaveProperty('country');
    }, TEST_TIMEOUT);
  });
});

// Helper functions to seed and clear test data
async function seedTestData() {
  try {
    const airportRepo = AppDataSource.getRepository(Airport);
    const flightRepo = AppDataSource.getRepository(Flight);
    const travelClassRepo = AppDataSource.getRepository(TravelClass);
    const flightClassDetailRepo = AppDataSource.getRepository(FlightClassDetail);

    // Clear existing test data first to avoid conflicts
    await flightClassDetailRepo.delete({});
    await flightRepo.createQueryBuilder().delete().execute();
    
    // Check if airports exist before creating them
    let jfk = await airportRepo.findOne({ where: { code: 'JFK' } });
    let lhr = await airportRepo.findOne({ where: { code: 'LHR' } });
    let cdg = await airportRepo.findOne({ where: { code: 'CDG' } });
    
    if (!jfk) {
      jfk = airportRepo.create({
        code: 'JFK',
        name: 'John F. Kennedy International Airport',
        city: 'New York',
        country: 'USA',
        image: 'https://example.com/jfk.jpg'
      });
      await airportRepo.save(jfk);
    }
    
    if (!lhr) {
      lhr = airportRepo.create({
        code: 'LHR',
        name: 'Heathrow Airport',
        city: 'London',
        country: 'UK',
        image: 'https://example.com/lhr.jpg'
      });
      await airportRepo.save(lhr);
    }
    
    if (!cdg) {
      cdg = airportRepo.create({
        code: 'CDG',
        name: 'Charles de Gaulle Airport',
        city: 'Paris',
        country: 'France',
        image: 'https://example.com/cdg.jpg'
      });
      await airportRepo.save(cdg);
    }

    // Check if travel classes exist before creating them
    let economy = await travelClassRepo.findOne({ where: { name: TravelClassType.ECONOMY } });
    let business = await travelClassRepo.findOne({ where: { name: TravelClassType.BUSINESS } });
    let first = await travelClassRepo.findOne({ where: { name: TravelClassType.FIRST } });
    
    if (!economy) {
      economy = travelClassRepo.create({
        name: TravelClassType.ECONOMY,
        price_multiplier: 1.0
      });
      await travelClassRepo.save(economy);
    }
    
    if (!business) {
      business = travelClassRepo.create({
        name: TravelClassType.BUSINESS,
        price_multiplier: 2.5
      });
      await travelClassRepo.save(business);
    }
    
    if (!first) {
      first = travelClassRepo.create({
        name: TravelClassType.FIRST,
        price_multiplier: 4.0
      });
      await travelClassRepo.save(first);
    }

    // Create flights
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const flight1 = flightRepo.create({
      flight_number: 'BA123',
      departure_airport: jfk,
      arrival_airport: lhr,
      departure_time: tomorrow,
      arrival_time: new Date(tomorrow.getTime() + 7 * 60 * 60 * 1000), // 7 hours later
      base_price: 500.00,
      available_seats: 150,
      rating: 4.5,
      featured_image: 'https://example.com/flight1.jpg',
      has_wifi: true,
      has_entertainment: true,
      has_meals: true,
      travel_classes: [economy, business, first]
    });

    const flight2 = flightRepo.create({
      flight_number: 'AF456',
      departure_airport: jfk,
      arrival_airport: cdg,
      departure_time: tomorrow,
      arrival_time: new Date(tomorrow.getTime() + 8 * 60 * 60 * 1000), // 8 hours later
      base_price: 550.00,
      available_seats: 120,
      rating: 4.2,
      featured_image: 'https://example.com/flight2.jpg',
      has_wifi: true,
      has_entertainment: true,
      has_meals: false,
      travel_classes: [economy, business]
    });

    const flight3 = flightRepo.create({
      flight_number: 'BA456',
      departure_airport: lhr,
      arrival_airport: jfk,
      departure_time: nextWeek,
      arrival_time: new Date(nextWeek.getTime() + 8 * 60 * 60 * 1000), // 8 hours later
      base_price: 520.00,
      available_seats: 140,
      rating: 4.3,
      featured_image: 'https://example.com/flight3.jpg',
      has_wifi: true,
      has_entertainment: false,
      has_meals: true,
      travel_classes: [economy, business, first]
    });

    await flightRepo.save([flight1, flight2, flight3]);

    // Create flight class details
    const flightClassDetail1 = flightClassDetailRepo.create({
      flight: flight1,
      travel_class: economy,
      available_seats: 100
    });

    const flightClassDetail2 = flightClassDetailRepo.create({
      flight: flight1,
      travel_class: business,
      available_seats: 40
    });

    const flightClassDetail3 = flightClassDetailRepo.create({
      flight: flight1,
      travel_class: first,
      available_seats: 10
    });

    const flightClassDetail4 = flightClassDetailRepo.create({
      flight: flight2,
      travel_class: economy,
      available_seats: 90
    });

    const flightClassDetail5 = flightClassDetailRepo.create({
      flight: flight2,
      travel_class: business,
      available_seats: 30
    });

    await flightClassDetailRepo.save([
      flightClassDetail1, 
      flightClassDetail2, 
      flightClassDetail3,
      flightClassDetail4,
      flightClassDetail5
    ]);
  } catch (error) {
    console.error("Error seeding test data:", error);
    throw error;
  }
}