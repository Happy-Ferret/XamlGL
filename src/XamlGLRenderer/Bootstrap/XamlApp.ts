﻿import * as XamlGLCore from './../XamlGL/Core';

export class XamlApp {
    element: HTMLElement;
    span: HTMLElement;
    timerToken: number;

    constructor(element: HTMLElement) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }

    Start() {
        this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);

        var url = document.body.getAttribute("xamlgl-app");

        if (!url) {
            console.warn("No application specified.");
            return;
        }

        let xm = new XamlGLCore.Renderer();
        xm.Test();
        
    }

    Stop() {
        clearTimeout(this.timerToken);
    }

    
    
}