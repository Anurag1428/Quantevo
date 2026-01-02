declare global {
    type SignInFormData = {
        email: string;
        password: string;
    };

    type SignUpFormData = {
        fullName: string;
        email: string;
        password: string;
        country: string;
        investmentGoals: string;
        riskTolerance: string;
        preferredIndustry: string;
    };

    type CountrySelectProps = {
        name: string;
        label: string;
        control: Control;
        error?: FieldError;
        required?: boolean;
    };

    type FormInputProps = {
        name: string;
        label: string;
        placeholder: string;
        type?: string;
        register: UseFormRegister;
        error?: FieldError;
        validation?: RegisterOptions;
        disabled?: boolean;
        value?: string;
    };

    type Option = {
        value: string;
        label: string;
    };

    type SelectFieldProps = {
        name: string;
        label: string;
        placeholder: string;
        options: readonly Option[];
        control: Control;
        error?: FieldError;
        required?: boolean;
    };

    type FooterLinkProps = {
        text: string;
        linkText: string;
        href: string;
    };

    type SearchCommandProps = {
        renderAs?: 'button' | 'text';
        label?: string;
        initialStocks: StockWithWatchlistStatus[];
    };

    type WelcomeEmailData = {
        email: string;
        name: string;
        intro: string;
    };

    type User = {
        id: string;
        name: string;
        email: string;
    };

    type Stock = {
        symbol: string;
        name: string;
        exchange: string;
        type: string;
    };

    type StockWithWatchlistStatus = Stock & {
        isInWatchlist: boolean;
    };

    type FinnhubSearchResult = {
        symbol: string;
        description: string;
        displaySymbol?: string;
        type: string;
    };

    type FinnhubSearchResponse = {
        count: number;
        result: FinnhubSearchResult[];
    };

    type StockDetailsPageProps = {
        params: Promise<{
            symbol: string;
        }>;
    };

    type WatchlistButtonProps = {
        symbol: string;
        company: string;
        isInWatchlist: boolean;
        showTrashIcon?: boolean;
        type?: 'button' | 'icon';
        onWatchlistChange?: (symbol: string, isAdded: boolean) => void;
    };

    type QuoteData = {
        c?: number;
        dp?: number;
    };

    type ProfileData = {
        name?: string;
        marketCapitalization?: number;
    };

    type FinancialsData = {
        metric?: { [key: string]: number };
    };

    type SelectedStock = {
        symbol: string;
        company: string;
        currentPrice?: number;
    };

    type WatchlistTableProps = {
        watchlist: StockWithData[];
    };

    type StockWithData = {
        userId: string;
        symbol: string;
        company: string;
        addedAt: Date;
        currentPrice?: number;
        changePercent?: number;
        priceFormatted?: string;
        changeFormatted?: string;
        marketCap?: string;
        peRatio?: string;
    };

    type AlertsListProps = {
        alertData: Alert[] | undefined;
    };

    type MarketNewsArticle = {
        id: number;
        headline: string;
        summary: string;
        source: string;
        url: string;
        datetime: number;
        category: string;
        related: string;
        image?: string;
    };

    type WatchlistNewsProps = {
        news?: MarketNewsArticle[];
    };

    type SearchCommandProps = {
        open?: boolean;
        setOpen?: (open: boolean) => void;
        renderAs?: 'button' | 'text';
        buttonLabel?: string;
        buttonVariant?: 'primary' | 'secondary';
        className?: string;
    };

    type AlertData = {
        symbol: string;
        company: string;
        alertName: string;
        alertType: 'upper' | 'lower';
        threshold: string;
    };

    type AlertModalProps = {
        alertId?: string;
        alertData?: AlertData;
        action?: string;
        open: boolean;
        setOpen: (open: boolean) => void;
    };

    type RawNewsArticle = {
        id: number;
        headline?: string;
        summary?: string;
        source?: string;
        url?: string;
        datetime?: number;
        image?: string;
        category?: string;
        related?: string;
    };

    type Alert = {
        id: string;
        symbol: string;
        company: string;
        alertName: string;
        currentPrice: number;
        alertType: 'upper' | 'lower';
        threshold: number;
        changePercent?: number;
    };

    type StrategyCondition = {
        type: 'price' | 'ma_cross' | 'rsi' | 'volume' | 'sentiment';
        symbol: string;
        operator: '>' | '<' | '==' | 'cross_above' | 'cross_below';
        value: number;
        period?: number; // for MA/RSI
        description: string;
    };

    type StrategyPerformance = {
        totalTrades: number;
        winRate: number; // percentage 0-100
        avgReturn: number; // percentage
        maxDrawdown: number; // percentage
        sharpeRatio: number;
        profitFactor: number; // win_sum / loss_sum
        bestTrade: number;
        worstTrade: number;
        backtestedFrom: Date;
        backtestedTo: Date;
    };

    type Strategy = {
        id: string;
        userId: string;
        author: {
            name: string;
            email?: string;
            avatar?: string;
        };
        title: string;
        description: string;
        conditions: StrategyCondition[];
        performance: StrategyPerformance;
        isPublic: boolean;
        subscribers: number;
        reputation: number; // 0-100 based on feedback
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        riskLevel: 'low' | 'medium' | 'high';
    };

    type StrategySubscription = {
        id: string;
        userId: string;
        strategyId: string;
        subscribedAt: Date;
        status: 'active' | 'paused' | 'cancelled';
    };

    type StrategyReview = {
        id: string;
        strategyId: string;
        userId: string;
        rating: number; // 1-5
        comment: string;
        createdAt: Date;
    };

    type CreateStrategyInput = {
        title: string;
        description: string;
        conditions: StrategyCondition[];
        riskLevel: 'low' | 'medium' | 'high';
        tags: string[];
        isPublic: boolean;
    };
}

export {};