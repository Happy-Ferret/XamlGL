﻿import { XamlMarkup } from "./../Reader/XamlMarkup";
import { FrameworkElement } from "./../Jupiter/FrameworkElement";
import { Grid } from "./../Controls/Grid";
import { Image } from "./../Controls/Image";
import { Panel } from "./../Controls/Panel";
import { Rectangle } from "./../Controls/Rectangle";
import { Thickness } from "./../DataTypes/Thickness";
import { HorizontalAlignment } from "./../DataTypes/HorizontalAlignment";
import { VerticalAlignment } from "./../DataTypes/VerticalAlignment";
import { ConsoleHelper } from "./ConsoleHelper";

export class XamlHelper {
    public static XamlMarkupToUIElement(xaml: XamlMarkup): FrameworkElement {
        ConsoleHelper.Log("XamlHelper.XamlMarkupToUIElement");
        let ret: FrameworkElement = this.ProcessHTMLElement(xaml.rootElement);
        // consoleHelper.Log(ret);
        return ret;
    }

    private static ProcessCollection(col: HTMLCollection): FrameworkElement {
        for (let x: number = 0; x < col.length; x++) {
            let child: Element = col.item(x);
            return this.ProcessElement(child);
        }
    }
    private static ProcessCollectionNodes(rootPanel: Panel, col: NodeList): FrameworkElement {
        if (!col) {
            return null;
        }

        for (let x: number = 0; x < col.length; x++) {
            let node: Node = col.item(x);
            let newFE: FrameworkElement = this.ProcessNode(node);
            if (newFE !== null) {
                rootPanel.Children.add(newFE);
            }
        }
        return rootPanel;
    }
    private static ProcessNode(el: Node): FrameworkElement {
        let newFE: FrameworkElement = this.GetFrameworkElementByNode(el);
        if (newFE instanceof Panel) {
            return this.ProcessCollectionNodes(newFE, el.childNodes);
        } else {
            return newFE;
        }
    }
    private static ProcessElement(el: Element): FrameworkElement {
        let container: FrameworkElement = this.GetFrameworkElementByElement(el);

        if (container !== null && container instanceof Panel) {
            return this.ProcessCollectionNodes(<Panel>container, el.childNodes);
        }
    }
    private static ProcessHTMLElement(el: HTMLElement): FrameworkElement {
        return this.ProcessCollection(el.children);
    }
    private static GetFrameworkElementByElement(el: Element): FrameworkElement {
        // consoleHelper.Log("XamlHelper.GetFrameworkElementByElement : " + el.nodeName);
        if (el.nodeName === "Grid") {
            let grid: Grid = new Grid();
            grid.HorizontalAlignment = this.StringToHorizontalAlignment(el.attributes.getNamedItem("HorizontalAlignment"));
            grid.VerticalAlignment = this.StringToVerticalAlignment(el.attributes.getNamedItem("VerticalAlignment"));
            grid.Width = this.StringToNumber(el.attributes.getNamedItem("Width"));
            grid.Height = this.StringToNumber(el.attributes.getNamedItem("Height"));
            if (el.hasAttribute("Background")) {
                grid.Background = el.attributes.getNamedItem("Background").value;
            }
            return grid;
        }
        return null;
    }

    private static GetFrameworkElementByNode(node: Node): FrameworkElement {
        // consoleHelper.Log("XamlHelper.GetFrameworkElementByNode : " + node.nodeName);
        if (node.nodeName === "Rectangle") {
            let rect: Rectangle = new Rectangle();
            rect.Width = this.StringToNumber(node.attributes.getNamedItem("Width"));
            rect.Height = this.StringToNumber(node.attributes.getNamedItem("Height"));
            rect.Background = node.attributes.getNamedItem("Fill").value;
            rect.BorderBrush = node.attributes.getNamedItem("Stroke").value;
            rect.Margin = this.StringToThickness(node.attributes.getNamedItem("Margin").value);
            let stokeThickness: number = this.StringToNumber(node.attributes.getNamedItem("StrokeThickness"));
            rect.BorderThickness = new Thickness(stokeThickness);
            return rect;
        } else if (node.nodeName === "Image") {
            let img: Image = new Image();
            img.Source = node.attributes.getNamedItem("Source").value;
            img.Width = this.StringToNumber(node.attributes.getNamedItem("Width"));
            img.Height = this.StringToNumber(node.attributes.getNamedItem("Height"));
            return img;
        } else if (node.nodeName === "Grid") {
            let grid: Grid = new Grid();
            grid.HorizontalAlignment = this.StringToHorizontalAlignment(node.attributes.getNamedItem("HorizontalAlignment"));
            grid.VerticalAlignment = this.StringToVerticalAlignment(node.attributes.getNamedItem("VerticalAlignment"));
            grid.Width = this.StringToNumber(node.attributes.getNamedItem("Width"));
            grid.Height = this.StringToNumber(node.attributes.getNamedItem("Height"));
            if (node.attributes.getNamedItem("Background") !== null) {
                grid.Background = node.attributes.getNamedItem("Background").value;
            }
            return grid;
        }
        return null;
    }
    // 0,0,0,0 = left, top, right, bottom<--
    private static StringToThickness(value: string): Thickness {
        let margin: Thickness = new Thickness(0);
        let parts: string[] = value.split(",");
        margin.Left = Number.parseInt(parts[0]);
        margin.Top = Number.parseInt(parts[1]);
        margin.Right = Number.parseInt(parts[2]);
        margin.Bottom = Number.parseInt(parts[3]);
        return margin;
    }
    private static StringToHorizontalAlignment(attr: Attr): HorizontalAlignment {
        if (attr === null) {
            return HorizontalAlignment.Stretch;
        }

        if (attr.value === "Left") {
            return HorizontalAlignment.Left;
        } else if (attr.value === "Center") {
            return HorizontalAlignment.Center;
        } else if (attr.value === "Right") {
            return HorizontalAlignment.Right;
        } else if (attr.value === "Stretch") {
            return HorizontalAlignment.Stretch;
        }
    }
    private static StringToNumber(attr: Attr): number {
        if (attr === null) {
            return 0;
        }

        return Number.parseInt(attr.value);
    }
    private static StringToVerticalAlignment(attr: Attr): VerticalAlignment {
        if (attr === null) {
            return VerticalAlignment.Stretch;
        }

        if (attr.value === "Bottom") {
            return VerticalAlignment.Bottom;
        } else if (attr.value === "Center") {
            return VerticalAlignment.Center;
        } else if (attr.value === "Top") {
            return VerticalAlignment.Top;
        } else if (attr.value === "Stretch") {
            return VerticalAlignment.Stretch;
        }
    }
}