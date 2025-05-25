import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
    const newsEntries = await getCollection('news');
    return rss({
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        site: context.site,
        items: newsEntries.map((news) => ({
            ...news.data,
            link: `/berita/${news.slug}/`,
            pubDate: news.data.pubDate,
            description: news.data.excerpt,
        })),
    });
}
