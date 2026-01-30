# RAG (Retrieval-Augmented Generation) Integration

A learning-focused implementation of RAG for the Quantevo trading platform.

## Overview

RAG combines **retrieval** of relevant data with **augmented** generation of contextual responses. This implementation enables users to query their investment strategies and portfolio data using natural language.

## Architecture

### Components

1. **RAG Client** (`lib/rag/ragClient.ts`)
   - `RAGRetriever`: Fetches relevant strategies and metrics
   - `RAGAugmenter`: Generates contextual answers
   - `RAGService`: Orchestrates retrieval and augmentation

2. **Custom Hook** (`hooks/useRAG.ts`)
   - `useRAG`: React hook for RAG queries in components

3. **UI Component** (`components/RAGSearch.tsx`)
   - Search interface with example queries
   - Response display with source attribution
   - Confidence scoring visualization

## Key Features

### 1. Strategy Retrieval
```typescript
// Searches strategies by:
// - Title matching
// - Description content
// - Tags
// - Risk level
const strategies = await RAGRetriever.retrieveStrategies(query, strategies);
```

### 2. Performance Metrics Retrieval
```typescript
// Extracts and ranks by:
// - Average return
// - Win rate
// - Sharpe ratio
// - Max drawdown
const metrics = await RAGRetriever.retrievePerformanceMetrics(query, strategies);
```

### 3. Risk-Based Filtering
```typescript
// Filters by risk profile:
// - Low (conservative)
// - Medium (balanced)
// - High (aggressive)
const filtered = await RAGRetriever.retrieveRiskData(query, strategies);
```

### 4. Context Augmentation
```typescript
// Combines:
// - Strategy data
// - Portfolio metrics
// - Recent alerts
// - Market snapshots
const context = await RAGRetriever.buildContext(strategies, portfolio, alerts);
```

## Usage Examples

### Basic Integration

```tsx
import { RAGSearch } from '@/components/RAGSearch';

export function MyPage() {
  return (
    <RAGSearch
      strategies={strategies}
      portfolio={portfolio}
      alerts={alerts}
      placeholder="Ask about your strategies..."
    />
  );
}
```

### Advanced Hook Usage

```tsx
import { useRAG } from '@/hooks/useRAG';

export function SearchComponent() {
  const {
    query,
    setQuery,
    response,
    isLoading,
    error,
    submitQuery,
    clearResponse,
  } = useRAG({
    strategies,
    portfolio,
    alerts,
  });

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask me anything..."
      />
      <button onClick={submitQuery} disabled={isLoading}>
        Search
      </button>
      {response && (
        <div>
          <p>{response.answer}</p>
          <p>Confidence: {(response.confidence * 100).toFixed(0)}%</p>
          <p>Sources: {response.sources.join(', ')}</p>
        </div>
      )}
    </div>
  );
}
```

## Query Examples

| Query | Response Type |
|-------|----------------|
| "Recommend a strategy for me" | Strategy recommendation |
| "Show my portfolio performance" | Portfolio analysis |
| "What are high-risk strategies?" | Filtered risk-based results |
| "Best momentum strategies" | Tag-based search |
| "How is my portfolio doing?" | Performance overview |
| "Conservative strategies" | Risk-filtered results |

## Data Flow

```
User Query
    ↓
Query Analysis (extract intent, keywords)
    ↓
Data Retrieval
├─ Strategy retrieval (title/description/tags)
├─ Performance metrics extraction
└─ Risk-based filtering
    ↓
Context Augmentation
├─ Build comprehensive context
├─ Format for LLM (if integrated)
└─ Calculate confidence score
    ↓
Response Generation
├─ Determine query type
├─ Generate contextual answer
├─ Attach source attribution
└─ Return confidence metrics
    ↓
Response to User
```

## Confidence Scoring

Confidence is calculated based on:
- Match ratio (relevant results / total strategies)
- Data completeness
- Query specificity

Range: 0.5 (low confidence) to 0.95 (high confidence)

## Future Enhancements

1. **LLM Integration**
   ```typescript
   // Connect to OpenAI/Claude for natural language generation
   const response = await llm.complete({
     messages: [{ role: 'user', content: formattedContext }],
     model: 'gpt-4',
   });
   ```

2. **Vector Embeddings**
   - Semantic similarity search
   - Better relevance ranking
   - Cross-strategy recommendations

3. **Caching Layer**
   ```typescript
   // Cache frequently asked questions
   const cached = await cache.get(`rag:${queryHash}`);
   ```

4. **Analytics**
   - Track popular queries
   - Measure response effectiveness
   - A/B test ranking algorithms

5. **Real-time Data**
   - Live market prices
   - Current portfolio values
   - Streaming alerts

## Learning Resources

### What You're Learning

- **Information Retrieval**: How to efficiently find relevant data
- **Context Building**: Preparing data for AI consumption
- **Confidence Metrics**: Measuring response quality
- **Type Safety**: TypeScript interfaces for robust code

### Related Concepts

- Vector databases (Pinecone, Weaviate)
- Semantic search
- LLM prompt engineering
- Information extraction
- Named entity recognition

## Demo

Visit `/rag-demo` to interact with the RAG system using mock data.

## Files Structure

```
lib/
  rag/
    ragClient.ts      # Core RAG logic
hooks/
  useRAG.ts           # React integration
components/
  RAGSearch.tsx       # UI component
app/
  rag-demo/
    page.tsx          # Demo page
```
