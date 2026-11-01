import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../src/App'

const dialog = () => document.querySelector('dialog') as HTMLDialogElement

beforeEach(() => {
  window.localStorage.clear()
  document.documentElement.lang = 'fr'
})
afterEach(cleanup)

async function openFromPlan(user: ReturnType<typeof userEvent.setup>, name: string) {
  const col = screen.getByRole('article', { name })
  await user.click(within(col).getByRole('button'))
}

describe('inquiry journey', () => {
  it('opens from a plan with that plan preselected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openFromPlan(user, 'Flexibilité')
    const d = within(dialog())
    expect(d.getByRole('radio', { name: /Entreposage de pneus \(particulier\)/ })).toBeChecked()
    expect(d.getByRole('radio', { name: /Flexibilité/ })).toBeChecked()
  })

  it('opens from a garage row with the garage plan preselected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Demander le forfait GARAGE50' }))
    expect(within(dialog()).getByRole('radio', { name: /GARAGE50/ })).toBeChecked()
  })

  it('keeps answers and step when the language changes mid-form', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openFromPlan(user, 'Basique')
    const d = within(dialog())
    await user.type(d.getByLabelText(/Décrivez vos pneus/), 'Michelin R16')
    await user.click(d.getByRole('button', { name: 'Continuer' }))
    await user.click(d.getByRole('radio', { name: 'Mes dates sont flexibles' }))
    await user.click(d.getByRole('button', { name: 'Continuer' }))
    await user.type(d.getByRole('textbox', { name: /^Nom/ }), 'Alex Exemple')

    await user.click(d.getByRole('button', { name: /English/ }))
    expect(document.documentElement.lang).toBe('en')
    expect(d.getByText('Step 3 of 4', { exact: false })).toBeInTheDocument()
    expect(d.getByRole('textbox', { name: /^Name/ })).toHaveValue('Alex Exemple')

    await user.click(d.getByRole('button', { name: 'Back' }))
    await user.click(d.getByRole('button', { name: 'Back' }))
    expect(d.getByLabelText(/Describe your tires/)).toHaveValue('Michelin R16')
    expect(d.getByRole('radio', { name: /Basique/ })).toBeChecked()
  })

  it('shows errors tied to fields and focuses the first invalid one', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openFromPlan(user, 'Basique')
    const d = within(dialog())
    await user.click(d.getByRole('button', { name: 'Continuer' })) // step 1 ok
    await user.click(d.getByRole('radio', { name: 'Mes dates sont flexibles' }))
    await user.click(d.getByRole('button', { name: 'Continuer' }))
    await user.click(d.getByRole('button', { name: 'Continuer' }))
    const name = d.getByRole('textbox', { name: /^Nom/ })
    expect(name).toHaveAttribute('aria-invalid', 'true')
    expect(name).toHaveFocus()
    expect(name).toHaveAccessibleDescription('Indiquez votre nom.')
  })

  it('completes the demo without any network call or stored personal data', async () => {
    const user = userEvent.setup()
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('no network in demo'))
    const beacon = vi.fn()
    Object.defineProperty(navigator, 'sendBeacon', { value: beacon, configurable: true })
    const xhrOpen = vi.spyOn(XMLHttpRequest.prototype, 'open')

    render(<App />)
    await openFromPlan(user, 'Liberté')
    const d = within(dialog())
    await user.click(d.getByRole('button', { name: 'Continuer' }))
    await user.click(d.getByRole('radio', { name: 'Mes dates sont flexibles' }))
    await user.click(d.getByRole('button', { name: 'Continuer' }))
    await user.type(d.getByRole('textbox', { name: /^Nom/ }), 'Alex Exemple')
    await user.type(d.getByRole('textbox', { name: /^Courriel/ }), 'alex@example.com')
    await user.click(d.getByRole('button', { name: 'Continuer' }))

    expect(d.getByText('alex@example.com')).toBeInTheDocument()
    const finish = d.getByRole('button', { name: 'Terminer la démonstration' })
    await user.dblClick(finish)
    expect(d.getByRole('heading', { name: 'Démonstration terminée. Aucune demande n’a été envoyée.' })).toBeInTheDocument()

    expect(fetchSpy).not.toHaveBeenCalled()
    expect(beacon).not.toHaveBeenCalled()
    expect(xhrOpen).not.toHaveBeenCalled()
    const stored = JSON.stringify({ ...window.localStorage }) + JSON.stringify({ ...window.sessionStorage }) + window.location.href
    expect(stored).not.toMatch(/Alex|alex@/)
    fetchSpy.mockRestore()
  })

  it('offers resume vs restart and asks before discarding answers', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openFromPlan(user, 'Basique')
    await user.type(within(dialog()).getByLabelText(/Décrivez vos pneus/), 'mes pneus')
    dialog().close() // Escape equivalent
    expect(dialog().open).toBe(false)

    await user.click(screen.getAllByRole('button', { name: 'Demander les disponibilités' })[0])
    const d = within(dialog())
    expect(d.getByText('Brouillon repris.')).toBeInTheDocument()
    expect(d.getByLabelText(/Décrivez vos pneus/)).toHaveValue('mes pneus')

    await user.click(d.getByRole('button', { name: 'Recommencer' }))
    expect(d.getByText(/Effacer toutes vos réponses/)).toBeInTheDocument()
    await user.click(d.getByRole('button', { name: 'Conserver' }))
    expect(d.getByLabelText(/Décrivez vos pneus/)).toHaveValue('mes pneus')

    await user.click(d.getByRole('button', { name: 'Recommencer' }))
    await user.click(d.getByRole('button', { name: 'Oui, effacer' }))
    expect(d.getByLabelText(/Décrivez vos pneus/)).toHaveValue('')
  })

  it('returns focus to the control that opened the dialog', async () => {
    const user = userEvent.setup()
    render(<App />)
    const trigger = screen.getAllByRole('button', { name: 'Demander les disponibilités' })[0]
    await user.click(trigger)
    dialog().close()
    expect(trigger).toHaveFocus()
  })

  it('carries a guide estimate into the inquiry', async () => {
    const user = userEvent.setup()
    render(<App />)
    const guide = within(document.getElementById('guide')!)
    await user.click(guide.getByRole('radio', { name: 'Un particulier' }))
    await user.click(guide.getByRole('radio', { name: /19 à 20/ }))
    await user.click(guide.getByRole('radio', { name: 'Ramassage à mon domicile' }))
    await user.click(guide.getByRole('button', { name: 'Utiliser cette estimation dans ma demande' }))
    const d = within(dialog())
    expect(d.getByRole('radio', { name: /Flexibilité/ })).toBeChecked()
    expect(d.getByText('Estimation du guide')).toBeInTheDocument()
  })
})
