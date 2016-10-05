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
import { ConsoleHelper } from "./../../../utils/ConsoleHelper";

export class Platform implements IPlatform {

    private _godRenderer: Renderer;
    private _content: FrameworkElement;

    get Renderer(): Renderer { return this._godRenderer; }

    constructor(width: number, height: number, antialias: boolean,
        transparent: boolean, htmlCanvasHost: JQuery) {
        this._godRenderer = new Renderer(width, height, antialias, transparent, htmlCanvasHost);
        ConsoleHelper.Log("Platform:constructor");
    }

    public SetCurrent(content: FrameworkElement): void {
        ConsoleHelper.LogSection("Platform:SetCurrent");
        this._content = content;
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

    public Draw(): void {
        ConsoleHelper.LogSectionHeader("Platform:Draw");
        if (this._godRenderer && this._content) {
            if (this._content instanceof Panel) {
                RendererHelper.DrawPanel(<Panel>this._content);
            }
        }
    }

    public CreateControlRenderer(element: IFrameworkElement): IControlRenderer {
        return RendererHelper.FrameworkElementToRenderer(element);
    }

}