/*
  Lista della spesa: ogni ingrediente di <ul class="ingredients"> diventa spuntabile.
  Le spunte restano salvate in questo browser (per pagina), così puoi chiudere e riaprire
  la ricetta al supermercato. Per usarlo: <script src="../spesa.js?v=1"></script> in fondo alla pagina.
  Le liste già interattive (class="check", es. il burfi) vengono lasciate stare.
*/
(() => {
  const key = "hub.spesa." + location.pathname;
  const load = () => { try { return new Set(JSON.parse(localStorage.getItem(key)) || []); } catch { return new Set(); } };
  const save = s => { try { s.size ? localStorage.setItem(key, JSON.stringify([...s])) : localStorage.removeItem(key); } catch {} };

  const lists = [...document.querySelectorAll("ul.ingredients:not(.check)")];
  if (!lists.length) return;
  const done = load();
  let n = 0;

  lists.forEach(ul => {
    ul.classList.add("check");
    ul.querySelectorAll(":scope > li").forEach(li => {
      const [name, qty] = li.children;
      const id = "ing" + n++;
      const box = document.createElement("input");
      box.type = "checkbox";
      box.id = id;
      box.checked = done.has(id);
      const label = document.createElement("label");
      label.htmlFor = id;
      label.append(...name.childNodes);
      if (qty) qty.classList.add("q");
      li.replaceChildren(box, label, ...(qty ? [qty] : []));
      li.classList.toggle("done", box.checked);
      box.addEventListener("change", () => {
        box.checked ? done.add(id) : done.delete(id);
        li.classList.toggle("done", box.checked);
        save(done);
        reset.hidden = !done.size;
      });
    });
  });

  const reset = document.createElement("button");
  reset.type = "button";
  reset.className = "spesa-reset";
  reset.textContent = "Togli tutte le spunte";
  reset.hidden = !done.size;
  reset.addEventListener("click", () => {
    done.clear();
    save(done);
    document.querySelectorAll("ul.ingredients.check input[type=checkbox]").forEach(b => {
      b.checked = false;
      b.closest("li").classList.remove("done");
    });
    reset.hidden = true;
  });
  lists[lists.length - 1].after(reset);
})();
