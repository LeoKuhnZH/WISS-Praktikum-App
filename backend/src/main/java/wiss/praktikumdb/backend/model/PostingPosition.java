package wiss.praktikumdb.backend.model;

import java.util.HashMap;
import java.util.Map;

public enum PostingPosition {
    ICTF("ICT-Fachmann/-frau EFZ"),
    UICT("ICT-Fachmann/-frau EFZ für quereinsteigende Erwachsene"),
    IFZA("Informatiker/in EFZ Lehre (Applikationsentwicklung)"),
    IFZP("Informatiker/in EFZ Lehre (Plattformentwicklung)"),
    UIFZ("Informatiker/in EFZ (Applikationsentwicklung) für quereinsteigende Erwachsene");

    private final String description;

    /*
    1. Create a static map to cache the string-to-enum mappings
     */
    private static final Map<String, PostingPosition> BY_DESCRIPTION = new HashMap<>();

    /*
    2. This static block runs once when the class is loaded
     */
    static {
        for (PostingPosition p : values()) {
            BY_DESCRIPTION.put(p.description.toLowerCase(), p);
        }
    }

    /*
    Constructor
     */
    PostingPosition(String description) {
        this.description = description;
    }

    /*
    Getter to go from Enum -> String
     */
    public String getDescription() {
        return this.description;
    }

    /**
     * Reverse lookup: Go from String -> Enum
     * @param description The raw string incoming (e.g., "fucked up")
     * @return The matching Fubar enum, or null if not found
     */
    public static PostingPosition fromString(String description) {
        if (description == null) {
            return null;
        }

        return BY_DESCRIPTION.get(description.toLowerCase().trim());
    }
}
