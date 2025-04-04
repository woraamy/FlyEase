// tests/mockServer.ts
import express from 'express';
import { Flight } from '../src/entity/Flight';
import { Airport } from '../src/entity/Airport';
import { AppDataSource } from '../src/data-source';
import { MoreThan } from 'typeorm';
import { TravelClass } from '../src/entity/TravelClass';

const mockApp = express();
mockApp.use(express.json());

// Repository instances
const flightRepo = AppDataSource.getRepository(Flight);
const airportRepo = AppDataSource.getRepository(Airport);
const travelClassRepo = AppDataSource.getRepository(TravelClass);

// GET /flights - List all available flights
mockApp.get('/flights', async (req, res) => {
  try {
    const flights = await flightRepo.find({
      where: { available_seats: MoreThan(0) },
      relations: ['departure_airport', 'arrival_airport', 'class_details', 'travel_classes'],
    });
    return res.json(flights);
  } catch (error) {
    console.error('Error fetching flights:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /flights/search - Search flights
mockApp.get('/flights/search', async (req, res) => {
  try {
    const { departure_airport_city, arrival_airport_city, departure_date, arrival_date } = req.query;

    const query = flightRepo.createQueryBuilder('flight')
      .leftJoinAndSelect('flight.departure_airport', 'departure_airport')
      .leftJoinAndSelect('flight.arrival_airport', 'arrival_airport')
      .leftJoinAndSelect('flight.class_details', 'class_details')
      .leftJoinAndSelect('class_details.travel_class', 'travel_class');

    if (departure_airport_city) {
      query.andWhere('departure_airport.city ILIKE :departure_airport_city', 
        { departure_airport_city: `%${departure_airport_city}%` });
    }

    if (arrival_airport_city) {
      query.andWhere('arrival_airport.city ILIKE :arrival_airport_city', 
        { arrival_airport_city: `%${arrival_airport_city}%` });
    }

    if (departure_date) {
      const start = new Date(departure_date as string);
      const end = new Date(departure_date as string);
      end.setHours(23, 59, 59, 999);
      query.andWhere('flight.departure_time BETWEEN :start AND :end', { start, end });
    }

    const flights = await query.getMany();
    return res.json(flights);
  } catch (error) {
    console.error('Error searching flights:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /flights/:flightId - Get flight by ID
mockApp.get('/flights/:flightId', async (req, res) => {
  try {
    const { flightId } = req.params;
    const flight = await flightRepo.findOne({
      where: { id: Number(flightId) },
      relations: ['departure_airport', 'arrival_airport', 'class_details', 'travel_classes'],
    });

    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    return res.json(flight);
  } catch (error) {
    console.error('Error fetching flight by ID:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /flights/travel-rec/:arrivalCity - Get flights by arrival city
mockApp.get('/flights/travel-rec/:arrivalCity', async (req, res) => {
  try {
    const { arrivalCity } = req.params;
    
    if (!arrivalCity) {
      return res.status(400).json({ error: 'Arrival city is required' });
    }

    const flights = await flightRepo
      .createQueryBuilder('flight')
      .leftJoinAndSelect('flight.departure_airport', 'departure_airport')
      .leftJoinAndSelect('flight.arrival_airport', 'arrival_airport')
      .leftJoinAndSelect('flight.class_details', 'class_details')
      .leftJoinAndSelect('flight.travel_classes', 'travel_classes')
      .where('LOWER(arrival_airport.city) = LOWER(:arrival_city)', { arrival_city: arrivalCity })
      .getMany();

    return res.json(flights);
  } catch (error) {
    console.error('Error fetching flights by arrival city:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /flights/by-airport/:code - Get flights by airport code
mockApp.get('/flights/by-airport/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const upperCode = code.toUpperCase();

    if (!code || (upperCode.length !== 3 && upperCode.length !== 4)) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Invalid airport code format. Code must be 3 or 4 characters.'
      });
    }

    const flights = await flightRepo.createQueryBuilder('flight')
      .leftJoinAndSelect('flight.departure_airport', 'departure_airport')
      .leftJoinAndSelect('flight.arrival_airport', 'arrival_airport')
      .leftJoinAndSelect('flight.travel_classes', 'travel_classes')
      .leftJoinAndSelect('flight.class_details', 'class_details')
      .where('UPPER(departure_airport.code) = :code OR UPPER(arrival_airport.code) = :code', { code: upperCode })
      .getMany();

    if (flights.length === 0) {
      return res.status(404).json({
        message: `No flights found for airport code ${upperCode}`
      });
    }

    return res.json(flights);
  } catch (error) {
    console.error('Error fetching flights by airport code:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /flights/recommend - Get flight recommendations
mockApp.post('/flights/recommend', async (req, res) => {
  try {
    // Mock response for testing
    return res.json({
      recommendations: [
        { destination: 'Paris', score: 0.95 },
        { destination: 'Rome', score: 0.85 }
      ]
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /airports - Get all airports
mockApp.get('/airports', async (req, res) => {
  try {
    const airports = await airportRepo.find();
    return res.json(airports);
  } catch (error) {
    console.error('Error fetching airports:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default mockApp;