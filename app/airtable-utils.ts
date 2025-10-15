import Airtable from 'airtable';

if (!process.env.NEXT_PUBLIC_AIRTABLE_API_KEY) {
  throw new Error('Missing Airtable API key');
}

if (!process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID) {
  throw new Error('Missing Airtable Base ID');
}

const base = new Airtable({ 
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY 
}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID);

export interface GiftReservation {
  id: string;
  giftId: string;
  reservedBy: string;
  timestamp: string;
}

export const saveReservation = async (giftId: string, reservedBy: string): Promise<void> => {
  try {
    // Trim inputs to remove whitespace
    const trimmedGiftId = giftId?.trim();
    const trimmedReservedBy = reservedBy?.trim();

    if (!trimmedGiftId) {
      throw new Error('giftId is required and cannot be empty');
    }

    if (!trimmedReservedBy) {
      throw new Error('reservedBy is required and cannot be empty');
    }

    const now = new Date().toISOString().split('T')[0];
    
    await base('Reservations').create([
      {
        fields: {
          giftId: trimmedGiftId,
          reservedBy: trimmedReservedBy,
          timestamp: now
        }
      }
    ]);
  } catch (error) {
    console.error('Error saving reservation:', error);
    throw error;
  }
};

export const getReservations = async (): Promise<GiftReservation[]> => {
  try {
    const records = await base('Reservations').select().all();
    return records
      .map(record => {
        const giftId = record.get('giftId');
        const reservedBy = record.get('reservedBy');
        const timestamp = record.get('timestamp');

        // Add more detailed logging to help debug the issue
        if (!giftId) {
          console.warn('Missing giftId in record:', record.id);
          return null;
        }
        
        // Convert any non-string giftId to string if possible
        const normalizedGiftId = String(giftId);
        
        return {
          id: record.id,
          giftId: normalizedGiftId,
          reservedBy: typeof reservedBy === 'string' ? reservedBy : '',
          timestamp: typeof timestamp === 'string' ? timestamp : new Date().toISOString().split('T')[0]
        };
      })
      .filter((record): record is GiftReservation => record !== null) as GiftReservation[];
  } catch (error) {
    console.error('Error fetching reservations:', error);
    throw error;
  }
};

export const deleteReservation = async (giftId: string): Promise<void> => {
  try {
    const records = await base('Reservations').select({
      filterByFormula: `{giftId} = '${giftId}'`
    }).all();

    if (records.length === 0) {
      throw new Error('Reservation not found');
    }

    await base('Reservations').destroy(records.map(record => record.id));
  } catch (error) {
    console.error('Error deleting reservation:', error);
    throw error;
  }
};