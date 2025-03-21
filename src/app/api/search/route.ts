import { getSearchResults } from "@/lib/api";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const count = parseInt(searchParams.get('count') || '5');
    const offset = parseInt(searchParams.get('offset') || '0');

    try {
        const result = await getSearchResults(query, count, offset);
        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Search API error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch search results' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}