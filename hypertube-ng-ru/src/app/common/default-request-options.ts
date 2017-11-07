import {BaseRequestOptions} from '@angular/http';
import {Injectable} from '@angular/core';
import {Headers} from '@angular/http';


@Injectable()
export class DefaultRequestOptions extends BaseRequestOptions {
  headers = new Headers({
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate',
    'Connection': 'keep-alive',
    'Cache-Control': 'max-age=0'
  });
}
