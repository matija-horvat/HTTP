import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable, interval, pipe } from 'rxjs';
import {switchMap, map} from 'rxjs/operators';
import { SearchResult } from './search-result.model';


export const YOUTUBE_API_KEY='AIzaSyDOfT_BO81aEZScosfTYMruJobmpjqNeEk';
export const YOUTUBE_API_URL='https://www.googleapis.com/youtube/v3/search';


@Injectable({
  providedIn: 'root'
})
export class YouTubeSearchService {

  constructor(private http: HttpClient,
              @Inject(YOUTUBE_API_KEY) private apiKey: string,
              @Inject(YOUTUBE_API_URL) private apiUrl: string) { }

  search(query: string): Observable<SearchResult[]>{

    const params: string = [
      `q=${query}`,
      `key=${this.apiKey}`,
      `part=snippet`,
      `type=video`,
      `maxResults=10`
    ].join('&');
    const queryUrl = `${YOUTUBE_API_URL}?${params}`;
    //const queryUrl = `${this.apiUrl}?${params}`; //this.apiUrl iz nekog razloga ne radi, onda idem direktno preko YOUTUBE_API_URL i radi
    

    return this.http.get(queryUrl).pipe(map(response =>{
      return <any>response['items'].map(item => {
          return new SearchResult({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnailUrl: item.snippet.thumbnails.high.url
          });

      });
    }));
  }
}
