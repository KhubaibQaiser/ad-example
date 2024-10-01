import { minifyHtml } from '@/generator/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const minified = await minifyHtml(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <title><%= data.title %></title>
        <style>
          html,
          body {
            margin: 0;
            padding: 0;
            overflow: hidden;
          }
        </style>
        <meta name="ad.size" content="width=<%= data.width %>, height=<%= data.height %>" />
      </head>
      <body>
        <iframe id="adIframe" src="ad/index.html" style="width: <%= data.width %>px; height: <%= data.height %>px; border: none"></iframe>
        <script src="ad/tracking.js"></script>
      </body>
    </html>
    `);

  return NextResponse.json({
    data: minified,
    error: null,
  });
}
