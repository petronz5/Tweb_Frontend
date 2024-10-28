import React from 'react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        // Aggiorna lo stato in modo che il prossimo rendering mostri l'interfaccia di fallback
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Puoi anche registrare l'errore in un servizio di reportistica
        console.error('Errore catturato da ErrorBoundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Puoi renderizzare qualsiasi interfaccia di fallback personalizzata
            return <h1>Si è verificato un errore nel caricamento della pagina.</h1>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
