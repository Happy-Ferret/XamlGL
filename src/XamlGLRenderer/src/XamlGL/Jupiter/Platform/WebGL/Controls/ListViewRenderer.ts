﻿import { IControlRenderer } from "./../../IControlRenderer";
import { BaseRenderer } from "./BaseRenderer";
// import { Renderer } from "./../Renderer";
// import { VisualElementChangedEventArgs } from "./../../IFrameworkElementRenderer";
import { FrameworkElement } from "./../../../FrameworkElement";
// import { IEventArgs } from "./../../../../Events/IEventArgs";
// import { IEvent } from "./../../../../Events/IEvent";
// import { EventDispatcher } from "./../../../../Events/EventDispatcher";
import { ConsoleHelper } from "./../../../../utils/ConsoleHelper";
import { ListView } from "./../../../Controls/ListView";
import { ListViewItem } from "./../../../Controls/ListViewItem";
import { StackPanel } from "./../../../Controls/StackPanel";
import { TextBlock } from "./../../../Controls/TextBlock";
// import { RendererHelper } from "./../../../../utils/RendererHelper";
// import { HorizontalAlignment } from "./../../../../DataTypes/HorizontalAlignment";
// import { VerticalAlignment } from "./../../../../DataTypes/VerticalAlignment";
import { Orientation } from "./../../../../DataTypes/Orientation";
import { Point } from "./../../../../DataTypes/Point";
// import { TextWrapping } from "./../../../../DataTypes/TextWrapping";
// import { TextWrappingAlign } from "./../../../../DataTypes/TextWrappingAlign";
import { IRenderer } from "./../../IRenderer";
import { IEventArgs } from "./../../../../Events/IEventArgs";

export class ListViewRenderer extends BaseRenderer implements IControlRenderer {
    private _listViewEl: ListView = null;
    private _listViewElRootContainer: StackPanel = null;
    Draw(r: IRenderer, args: IEventArgs): void {
        super.Draw(r,args);
        // fill from Draw
    }
    InitializeResources(): void {
        super.InitializeResources();
        ConsoleHelper.Log("ListViewRenderer.InitializeResources");

        this._listViewEl = <ListView>super.Element;
        if (this.PixiElement === undefined) {
            this.PixiElement = new PIXI.Container();
        }

        // let parentContainer: PIXI.Container = <PIXI.Container>super.Element.Parent.Renderer.PixiElement;

        // this.PixiElement = text;

        // calculate y position
        this.CalculateYHeight(this._listViewEl);

        // calculate X position
        this.CalculateXWidth(this._listViewEl);

        // take margin into account
        this.UpdateCalculatedValuesUsingMargin(this._listViewEl);

        // determine starting SLOT if the parent is a PANEL that lays out its children
        let parentXYStart: Point = this.CalculateCurrentAvailableSlot();

        // position container
        this.PixiElement.position.set(this.Element.CalculatedX + parentXYStart.X, this.Element.CalculatedY + parentXYStart.Y);

        // size container
        (<PIXI.Container>this.PixiElement).height = this.Element.CalculatedHeight;
        (<PIXI.Container>this.PixiElement).width = this.Element.CalculatedWidth;


        // initialize the root and children content
        if (this._listViewEl.Children.size() > 0) {
            this._listViewElRootContainer = <StackPanel>this._listViewEl.Content;
            this._listViewElRootContainer.Orientation = Orientation.Vertical;
            this._listViewElRootContainer.Renderer.InitializeResources();
            this._listViewEl.Children.forEach(x => {
                let lvi: ListViewItem = <ListViewItem>x;
                let tb: TextBlock = new TextBlock();
                tb.Text = lvi.Content;
                tb.FontSize = 20;
                tb.FontFamily = "Sans-Serif";
                tb.Color = "black"
                console.log(this._listViewElRootContainer.CurrentItemRenderXY);
                tb.CalculatedY = this._listViewElRootContainer.CurrentItemRenderXY;
                // tb.Parent = <FrameworkElement>this._listViewElRootContainer;
                
                this._listViewElRootContainer.Children.add(tb);

                // add new tb to parent container and set its platform so it can render itself
                this._listViewElRootContainer.Platform.SetCurrent(tb, this._listViewElRootContainer);
                this._listViewElRootContainer.Platform.LoadDynamicControl(tb);
                
                // tell the parent stackpanel the next available slot
                this.IncrementNextAvailableSlotOfStackPanel(this._listViewElRootContainer, this.Element.CalculatedWidth, 0);
            });
        }


        
        // render graphics (DisplayObject) on PIXI stage
        let parentContainer: PIXI.Container = null;
        if (this.Element.Parent.Renderer === undefined) { // root panel (top of visual tree)
            this.Element.Platform.Renderer.PixiStage.addChild(this.PixiElement);
        } else {
            if (this.Element.Parent.Renderer.PixiElement && this.Element.Parent.Renderer.PixiElement instanceof PIXI.Container) {
                parentContainer = <PIXI.Container>this.Element.Parent.Renderer.PixiElement;
                parentContainer.addChild(this.PixiElement);
            }
        }

    }
    RefreshUI(): void {
        // todo : fill with actual pixi draw stuff that is idempotent
    }
    Clear(): void {
        ConsoleHelper.Log("ListViewRenderer.Clear");

        let containerMain: PIXI.Container = null;
        let pc: PIXI.Container =  <PIXI.Container>this.Element.Parent.Renderer.PixiElement;

        if (this.PixiElement !== undefined) {
            containerMain = <PIXI.Container>this.PixiElement;
            // this.Element.Platform.Renderer.PixiStage.removeChild(containerMain);
            pc.removeChild(this.PixiElement);
            this.PixiElement = null;
        }
    }
}