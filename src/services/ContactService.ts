import * as Contacts from 'expo-contacts';

export interface Contact {
    id: string;
    name: string;
    phoneNumbers: string[];
}

export class ContactService {
    /**
     * Request contacts permission
     */
    static async requestPermission(): Promise<boolean> {
        const { status } = await Contacts.requestPermissionsAsync();
        return status === 'granted';
    }

    /**
     * Search contacts by name (fuzzy matching for Hindi/Hinglish)
     */
    static async searchByName(name: string): Promise<Contact[]> {
        try {
            const hasPermission = await this.requestPermission();
            if (!hasPermission) {
                console.error('Contacts permission denied');
                return [];
            }

            const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
            });

            if (!data || data.length === 0) {
                return [];
            }

            // Normalize search term
            const searchTerm = name.toLowerCase().trim();

            // Filter contacts by name (fuzzy matching)
            const matches = data.filter(contact => {
                const contactName = contact.name?.toLowerCase() || '';
                const firstName = contact.firstName?.toLowerCase() || '';
                const lastName = contact.lastName?.toLowerCase() || '';

                return contactName.includes(searchTerm) ||
                    firstName.includes(searchTerm) ||
                    lastName.includes(searchTerm);
            });

            // Map to our Contact interface
            return matches.map(contact => ({
                id: contact.id,
                name: contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim(),
                phoneNumbers: contact.phoneNumbers?.map(p => p.number || '') || []
            }));
        } catch (error) {
            console.error('Contact search error:', error);
            return [];
        }
    }

    /**
     * Get contact by exact ID
     */
    static async getById(id: string): Promise<Contact | null> {
        try {
            const hasPermission = await this.requestPermission();
            if (!hasPermission) {
                return null;
            }

            const contact = await Contacts.getContactByIdAsync(id);
            if (!contact) return null;

            return {
                id: contact.id,
                name: contact.name || `${contact.firstName || ''} ${contact.lastName || ''}`.trim(),
                phoneNumbers: contact.phoneNumbers?.map(p => p.number || '') || []
            };
        } catch (error) {
            console.error('Get contact error:', error);
            return null;
        }
    }

    /**
     * Get primary phone number for a contact
     */
    static getPrimaryPhone(contact: Contact): string | null {
        if (contact.phoneNumbers.length === 0) return null;
        return contact.phoneNumbers[0];
    }

    /**
     * Common Hindi/Hinglish name mappings
     */
    static normalizeHindiName(name: string): string {
        const mappings: { [key: string]: string } = {
            'mummy': 'mom',
            'papa': 'dad',
            'bhai': 'brother',
            'behen': 'sister',
            'dost': 'friend',
            'dada': 'grandfather',
            'dadi': 'grandmother',
            'nana': 'grandfather',
            'nani': 'grandmother',
            'chacha': 'uncle',
            'chachi': 'aunt',
            'mama': 'uncle',
            'mami': 'aunt'
        };

        const normalized = name.toLowerCase().trim();
        return mappings[normalized] || normalized;
    }
}
