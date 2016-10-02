﻿import { IPlatform } from "./IPlatform";

import { Renderer } from "./RendererWebGL";

export class Platform implements IPlatform {

    private _renderer: Renderer;
    get Renderer(): Renderer { return this._renderer; }

    constructor(width: number, height: number, antialias: boolean, transparent: boolean) {
        this._renderer = new Renderer(width, height, antialias, transparent);

    }
}