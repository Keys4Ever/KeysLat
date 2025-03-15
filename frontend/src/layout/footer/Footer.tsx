export const Footer  = () => {

    return(
    <footer className="bg-[#1f2d4099] text-white border-[1px] border-solid border-x-transparent border-b-transparent border-t-[#f8ee33] mt-4 w-full">
        <div className="flex items-center justify-center w-full m-auto p-3">
          <span>Hecho con ❤️ por Keys4Ever</span>
          <div className="flex flex-row flex-nowrap gap-2 items-center ml-auto">
            <a href="https://github.com/Keys4Ever/URLShortener" aria-label="Revisa mi github">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.418 2.865 8.165 6.84 9.486.5.092.686-.216.686-.482 0-.238-.008-.872-.013-1.71-2.785.606-3.373-1.343-3.373-1.343-.454-1.152-1.109-1.458-1.109-1.458-.905-.619.069-.608.069-.608 1.003.070 1.529 1.032 1.529 1.032.892 1.527 2.338 1.085 2.91.832.089-.647.349-1.085.635-1.334-2.221-.254-4.556-1.11-4.556-4.94 0-1.091.39-1.985 1.029-2.684-.103-.254-.447-1.272.098-2.654 0 0 .844-.271 2.761 1.029a9.613 9.613 0 0 1 2.515-.338c.854.004 1.709.114 2.515.338 1.915-1.3 2.761-1.029 2.761-1.029.546 1.382.202 2.4.098 2.654.639.699 1.029 1.593 1.029 2.684 0 3.838-2.34 4.684-4.572 4.934.358.305.677.897.677 1.805 0 1.302-.014 2.351-.014 2.666 0 .268.183.575.692.478C19.138 20.16 22 16.418 22 12c0-5.52-4.48-10-10-10z" fill="#ffffff" />
              </svg>
            </a>
            <a href="https://wa.me/5491137018186" aria-label="Contactame a través de Whatsapp">
              <svg width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
                <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
      )

}