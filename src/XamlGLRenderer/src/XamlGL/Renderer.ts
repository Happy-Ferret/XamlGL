﻿/// <reference path="../../typings/globals/pixi.js/index.d.ts" />
/// <reference path="../../typings/globals/jquery/index.d.ts" />
/// <reference path="../../typings/globals/rivets/index.d.ts" />

import { ViewManager } from "./ViewManager"

export class Renderer {

    constructor() {

    }

    public Start(): void {
        console.log(PIXI);

        ViewManager.RenderView("pixi-test.html", PIXI);
    }
}
