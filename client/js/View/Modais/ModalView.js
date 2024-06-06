export class ModalView{
    constructor(title, readOnlyTitle, body){       
        this._title = title; 
        this._readOnlyTitle = readOnlyTitle;        
        this._body = body;
        this._main =  document.querySelector('main');
    }

    show(){
        this._main.insertAdjacentHTML("beforebegin", this.template(this._title));
    }

    showReadOnly(){ 
        this._main.insertAdjacentHTML('beforebegin', this.template(this._readOnlyTitle));
        document.querySelectorAll('#myModal input').forEach(input => input.setAttribute('readOnly', 'true'));    
        document.querySelectorAll('#myModal select').forEach(input => input.setAttribute('disabled', 'true'));              
    }

    hide(){
        document.querySelector('#myModal').remove();
    }

    template(title){
        return `
            <div id="myModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg shadow-lg w-1/2">
                    <!--Header-->
                    <div class="background1 flex justify-between items-center p-4 rounded-t-lg">
                        <h2 class="text-lg">${title}</h2>
                        <button id="close-modal" class="icon1"">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 inline">
                            <path fill-rule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                            clip-rule="evenodd" />
                        </svg>
                        </button>
                    </div>
                    <!--Body-->
                    ${this._body}
                </div>
            </div>
        `
    }


}  
