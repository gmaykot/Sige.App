import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AlertService } from '../../../@core/services/util/alert.service';
import { SessionStorageService } from '../../../@core/services/util/session-storage.service';
import { CacheService } from '../../../@core/services/administrativo/cache.service';
import { IResponseInterface } from '../../../@core/data/response.interface';

@Component({
  selector: 'ngx-ghost',
  templateUrl: './ghost.component.html',
  styleUrls: ['./ghost.component.scss']
})
export class GhostComponent implements OnInit {
  public habilitaOperacoes: boolean = false;
  public loading = false;
  public source: string[] = []
  public control = this.formBuilder.group({
    key: "",
  });

  constructor(
    private formBuilder: FormBuilder,
    private cacheService: CacheService,
    private alertService: AlertService
  ) { }

  async ngOnInit() {
    this.habilitaOperacoes = SessionStorageService.habilitaOperacoes();
    await this.listCache();
  }

  async listCache() {
    this.loading = true;
    await this.cacheService.listCache().then((response: string[]) => {
      if (response) {
        this.source = response;
      } else {
        this.source = [];
      }
    });
    this.loading = false;
  }
  async clear() {
    this.loading = true;
    await this.cacheService.clearCache({ descricao: this.control.value.key }).then((response: any) => {
      this.alertService.showSuccess('Chave removida com sucesso.');
      this.listCache();
      this.control.reset();
    });
    this.loading = false;
  }

  async clearAll() {
    this.loading = true;
    await this.cacheService.clearCache(null).then((response: any) => {
      this.alertService.showSuccess('Cache limpo com sucesso.');
      this.listCache();
    });
    this.loading = false;
  }
}
