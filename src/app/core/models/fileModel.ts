
import { Injectable } from "@angular/core";
import { Adapter } from "../interfaces/adapter";

export class FileModel {

    constructor(
        public id?: number,
        public original_name?: string,
        public encrypt_name?: string,
        public path?: string,
        public size?: number,
        public real_path?: string,
    ){}

}

@Injectable({
    providedIn: "root",
  })
  export class AffectRangeAdapter implements Adapter<FileModel> {
    adapt(item: any): FileModel {
      return new FileModel(item.id,item.original_name, item.encrypt_name,
        item.path,item.size,item.real_path);
    }
  }