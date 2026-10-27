import { useState } from "react";
import { render, screen, fireEvent, createEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { FileUploadField, type FileUploadFieldProps, type FileUploadFile } from "./FileUploadField";

const makeFile = (name: string, size = 1024) =>
  new File([new Uint8Array(size)], name, { type: "application/octet-stream" });

// Stateful wrapper so added/removed files render like in a real form
function Controlled({ initial = [], onSave, ...props }: Partial<FileUploadFieldProps> & {
  initial?: FileUploadFile[];
  onSave?: (files: FileUploadFile[]) => void;
}) {
  const [files, setFiles] = useState<FileUploadFile[]>(initial);
  return (
    <FileUploadField
      label="Documents"
      {...props}
      value={files}
      saveInto={(v) => {
        setFiles(v);
        onSave?.(v);
      }}
    />
  );
}

const getInput = () => screen.getByLabelText("Documents", { selector: "input" }) as HTMLInputElement;

const getDropZone = () => screen.getByText("Drop or paste files here").parentElement as HTMLElement;

const drop = (target: HTMLElement, files: File[]) =>
  fireEvent.drop(target, { dataTransfer: { files, types: ["Files"] } });

// ─── Rendering ───────────────────────────────────────────────────────────────

describe("FileUploadField - rendering", () => {
  it("returns null when showWhen is false", () => {
    const { container } = render(<FileUploadField label="Documents" showWhen={false} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders the upload button and default compact placeholder", () => {
    render(<FileUploadField label="Documents" />);
    expect(screen.getByRole("button", { name: "Upload" })).toBeInTheDocument();
    expect(screen.getByText("Drop or paste files here")).toBeInTheDocument();
  });

  it("uses the expanded placeholder for EXPANDED drop zones", () => {
    render(<FileUploadField label="Documents" dropZoneStyle="EXPANDED" />);
    expect(screen.getByText("drop them here")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Upload" })).toBeInTheDocument();
  });

  it("replaces the default text with placeholder", () => {
    render(<FileUploadField label="Documents" placeholder="Drop your claim form" />);
    expect(screen.getByText("Drop your claim form")).toBeInTheDocument();
    expect(screen.queryByText("Drop or paste files here")).not.toBeInTheDocument();
  });

  it("names an icon-only button", () => {
    render(<FileUploadField label="Documents" buttonDisplay="ICON" />);
    const button = screen.getByRole("button", { name: "Upload" });
    expect(button).not.toHaveTextContent("Upload");
  });

  it("labels the group and describes it with instructions", () => {
    render(<FileUploadField label="Documents" instructions="PDF only" />);
    expect(screen.getByRole("group", { name: "Documents" })).toHaveAccessibleDescription("PDF only");
  });

  it("lists the files in value with their size", () => {
    render(<FileUploadField label="Documents" value={[{ name: "policy.pdf", size: 2048 }]} />);
    expect(screen.getByText("policy.pdf")).toBeInTheDocument();
    expect(screen.getByText("PDF • 2.0 KB")).toBeInTheDocument();
  });

  it("restricts the native picker to allowedExtensions", () => {
    render(<FileUploadField label="Documents" allowedExtensions={["pdf", ".DOCX"]} />);
    expect(getInput()).toHaveAttribute("accept", ".pdf,.docx");
  });
});

// ─── Adding files ────────────────────────────────────────────────────────────

describe("FileUploadField - adding files", () => {
  it("adds files chosen with the file picker", async () => {
    const onSave = vi.fn();
    render(<Controlled onSave={onSave} />);
    const file = makeFile("report.pdf");

    await userEvent.upload(getInput(), file);

    expect(onSave).toHaveBeenCalledWith([file]);
    expect(screen.getByText("report.pdf")).toBeInTheDocument();
  });

  it("opens the file picker from the upload button", async () => {
    render(<FileUploadField label="Documents" />);
    const click = vi.spyOn(getInput(), "click");
    await userEvent.click(screen.getByRole("button", { name: "Upload" }));
    expect(click).toHaveBeenCalled();
  });

  it("adds dropped files and shows a dragging state", () => {
    const onSave = vi.fn();
    render(<Controlled onSave={onSave} />);
    const zone = getDropZone();

    fireEvent.dragOver(zone, { dataTransfer: { dropEffect: "none", types: ["Files"] } });
    expect(zone).toHaveClass("border-blue-500");

    const file = makeFile("photo.png");
    drop(zone, [file]);

    expect(zone).not.toHaveClass("border-blue-500");
    expect(onSave).toHaveBeenCalledWith([file]);
  });

  it("adds pasted files", () => {
    const onSave = vi.fn();
    render(<Controlled onSave={onSave} />);
    const file = makeFile("pasted.png");
    const zone = getDropZone();
    const paste = createEvent.paste(zone);
    Object.defineProperty(paste, "clipboardData", { value: { files: [file] } });

    fireEvent(zone, paste);

    expect(onSave).toHaveBeenCalledWith([file]);
  });

  it("appends to existing files", async () => {
    const existing = { name: "existing.pdf", size: 10 };
    const onSave = vi.fn();
    render(<Controlled initial={[existing]} onSave={onSave} />);
    const file = makeFile("new.pdf");

    await userEvent.upload(getInput(), file);

    expect(onSave).toHaveBeenCalledWith([existing, file]);
  });

  it("calls onChange as an alias for saveInto", async () => {
    const onChange = vi.fn();
    render(<FileUploadField label="Documents" onChange={onChange} />);
    const file = makeFile("a.pdf");
    await userEvent.upload(getInput(), file);
    expect(onChange).toHaveBeenCalledWith([file]);
  });

  it("can select the same file again after removing it", async () => {
    const onSave = vi.fn();
    render(<Controlled onSave={onSave} />);
    const file = makeFile("same.pdf");

    await userEvent.upload(getInput(), file);
    expect(getInput().value).toBe("");
    await userEvent.click(screen.getByRole("button", { name: "Remove same.pdf" }));
    await userEvent.upload(getInput(), file);

    expect(onSave).toHaveBeenLastCalledWith([file]);
  });
});

// ─── Removing files ──────────────────────────────────────────────────────────

describe("FileUploadField - removing files", () => {
  const initial = [
    { name: "one.pdf", size: 10 },
    { name: "two.pdf", size: 20 },
  ];

  it("removes a file and saves the remaining list", async () => {
    const onSave = vi.fn();
    render(<Controlled initial={initial} onSave={onSave} />);

    await userEvent.click(screen.getByRole("button", { name: "Remove one.pdf" }));

    expect(onSave).toHaveBeenCalledWith([initial[1]]);
    expect(screen.queryByText("one.pdf")).not.toBeInTheDocument();
  });

  it("moves focus to the next remove button, then to the upload button", async () => {
    render(<Controlled initial={initial} />);

    await userEvent.click(screen.getByRole("button", { name: "Remove one.pdf" }));
    expect(screen.getByRole("button", { name: "Remove two.pdf" })).toHaveFocus();

    await userEvent.click(screen.getByRole("button", { name: "Remove two.pdf" }));
    expect(screen.getByRole("button", { name: "Upload" })).toHaveFocus();
  });
});

// ─── Rejections ──────────────────────────────────────────────────────────────

describe("FileUploadField - rejected files", () => {
  it("rejects disallowed types with an announced error", () => {
    const onSave = vi.fn();
    render(<Controlled onSave={onSave} allowedExtensions={["pdf", "docx"]} />);
    const good = makeFile("ok.PDF");

    drop(getDropZone(), [makeFile("photo.png"), good]);

    expect(onSave).toHaveBeenCalledWith([good]);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "photo.png cannot be uploaded. Only PDF or DOCX files are supported."
    );
  });

  it("rejects files over maxFileSize", () => {
    const onSave = vi.fn();
    render(<Controlled onSave={onSave} maxFileSize={1024} />);

    drop(getDropZone(), [makeFile("big.pdf", 4096)]);

    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "big.pdf cannot be uploaded. Files must be 1.0 KB or smaller."
    );
  });

  it("clears upload errors on the next successful upload", () => {
    render(<Controlled allowedExtensions={["pdf"]} />);
    drop(getDropZone(), [makeFile("photo.png")]);
    expect(screen.getByRole("alert")).toBeInTheDocument();

    drop(getDropZone(), [makeFile("ok.pdf")]);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("links errors to the group", () => {
    render(<Controlled allowedExtensions={["pdf"]} />);
    drop(getDropZone(), [makeFile("photo.png")]);
    expect(screen.getByRole("group", { name: "Documents" })).toHaveAccessibleDescription(
      "photo.png cannot be uploaded. Only PDF files are supported."
    );
  });
});

// ─── maxSelections ───────────────────────────────────────────────────────────

describe("FileUploadField - maxSelections", () => {
  it("adds only up to the limit and explains why", () => {
    const onSave = vi.fn();
    render(<Controlled onSave={onSave} maxSelections={2} />);
    const files = [makeFile("a.pdf"), makeFile("b.pdf"), makeFile("c.pdf")];

    drop(getDropZone(), files);

    expect(onSave).toHaveBeenCalledWith(files.slice(0, 2));
    expect(screen.getByRole("alert")).toHaveTextContent("The maximum number of files is 2.");
  });

  it("hides the drop zone once the limit is reached and focuses the last file", async () => {
    render(<Controlled maxSelections={1} />);

    // A change event alone, as after the native picker closes. userEvent.upload
    // also simulates clicking the hidden input, which moves focus to <body>.
    fireEvent.change(getInput(), { target: { files: [makeFile("only.pdf")] } });

    expect(screen.queryByRole("button", { name: "Upload" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove only.pdf" })).toHaveFocus();
  });

  it("allows uploads again after a file is removed", async () => {
    render(<Controlled maxSelections={1} initial={[{ name: "only.pdf", size: 10 }]} />);
    await userEvent.click(screen.getByRole("button", { name: "Remove only.pdf" }));
    expect(screen.getByRole("button", { name: "Upload" })).toBeInTheDocument();
  });

  it("only allows a single file in the picker when maxSelections is 1", () => {
    render(<FileUploadField label="Documents" maxSelections={1} />);
    expect(getInput()).not.toHaveAttribute("multiple");
  });
});

// ─── Disabled, required, validations ─────────────────────────────────────────

describe("FileUploadField - states", () => {
  it("keeps files visible but not removable when disabled", () => {
    render(<FileUploadField label="Documents" disabled value={[{ name: "locked.pdf", size: 10 }]} />);
    expect(screen.getByText("locked.pdf")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Remove locked.pdf" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Upload" })).toBeDisabled();
  });

  it("ignores dropped files when disabled", () => {
    const onSave = vi.fn();
    render(<Controlled disabled onSave={onSave} />);
    drop(getDropZone(), [makeFile("a.pdf")]);
    expect(onSave).not.toHaveBeenCalled();
  });

  it("shows the required indicator and requiredMessage when empty", () => {
    render(<FileUploadField label="Documents" required requiredMessage="Attach at least one file" />);
    expect(screen.getByLabelText("required")).toHaveTextContent("*");
    expect(screen.getByText("Attach at least one file")).toBeInTheDocument();
  });

  it("shows validations", () => {
    render(<FileUploadField label="Documents" validations={["Upload the signed form"]} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Upload the signed form");
  });
});
