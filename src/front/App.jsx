import React from 'react';
import JournalForm from './components/JournalForm';

const App = () => {
    const handleJournalSubmit = async (journal) => {
        try {
            const response = await fetch('/api/journals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(journal), // use 'journal' not 'data'
            });

            if (!res.ok) throw new Error('Failed to post journal');
            const result = await response.json();
            console.log('Journal posted:', result);
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div>
            <JournalForm onSubmit={handleJournalSubmit} />
        </div>
    );
};

export default App;