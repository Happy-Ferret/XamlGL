﻿import { IPlatform } from "./../IPlatform";

import { Renderer } from "./Renderer";
// import { IUIElement } from "./../../IUIElement";
import { IFrameworkElement } from "./../../IFrameworkElement";
import { FrameworkElement } from "./../../FrameworkElement";
import { IUIElement } from "./../../IUIElement";
// import { IFrameworkElementRenderer } from "./../IFrameworkElementRenderer";
import { IControlRenderer } from "./../IControlRenderer";
import { Panel } from "./../../../Controls/Panel";
// import { Image } from "./../../../Controls/Image";
import { RendererHelper } from "./../../../utils/RendererHelper";

export class Platform implements IPlatform {

    private _godRenderer: Renderer;

    get Renderer(): Renderer { return this._godRenderer; }

    constructor(width: number, height: number, antialias: boolean,
        transparent: boolean, htmlCanvasHost: JQuery) {
        this._godRenderer = new Renderer(width, height, antialias, transparent, htmlCanvasHost);
        console.log("Platform:constructor");
    }

    public SetCurrent(content: FrameworkElement): void {
        console.log("Platform:SetCurrent  ====================== ");
        content.Platform = this;

        // process root
        let fe: IControlRenderer = this.CreateControlRenderer(content);
        fe.Element = content;

        // process each child and so on
        if (content instanceof Panel) {
            let panel: Panel = <Panel>content;
            panel.Children.forEach((x: IUIElement) => {
                this.SetCurrent.call(this, x);
            });
        }

    }

    public CreateControlRenderer(element: IFrameworkElement): IControlRenderer {
        return RendererHelper.FrameworkElementToRenderer(element);
    }

}