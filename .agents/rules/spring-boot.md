---
trigger: always_on
---

---
description: 
alwaysApply: true
---

---
description: Spring Boot & Spring Framework best practices
globs: **/*.java
alwaysApply: false
---

## Spring Boot & Spring Framework Standards

- **Architecture**
  - Keep controllers thin; move business logic into `@Service` classes.
  - Use `@Repository` for data access and let Spring Data JPA handle common CRUD.
  - Use DTOs at API boundaries; do **not** expose entities directly in controllers.

- **Dependency Injection**
  - Prefer **constructor injection** for required dependencies (optionally with Lombok `@RequiredArgsConstructor`).
  - Avoid field injection (`@Autowired` on fields) except in rare cases (tests, optional deps).

- **Project Structure**
  - Follow a clear package layout:
    - `config` for `@Configuration` and security
    - `controller` for `@RestController`
    - `service` for `@Service`
    - `repository` for `@Repository`
    - `model/entity` for JPA entities
    - `model/dto` for request/response DTOs
    - `exception` for custom exceptions and `@RestControllerAdvice`.

- **REST APIs**
  - Use `@RestController` + `@RequestMapping("/api/v1/...")` for REST endpoints.
  - Use `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping` per HTTP verb.
  - Validate request bodies with `@Valid` and Bean Validation annotations on DTOs.
  - Return `ResponseEntity<T>` where status codes matter; otherwise explicit `@ResponseStatus`.

- **Error Handling**
  - Centralize error handling with `@RestControllerAdvice` and `@ExceptionHandler`.
  - Map domain errors (`EntityNotFoundException`, `DuplicateEntityException`, etc.) to proper HTTP status codes.
  - Do not swallow exceptions; log and rethrow domain-specific exceptions when appropriate.

- **Data Access**
  - Use Spring Data repositories (`extends JpaRepository<...>`) for CRUD.
  - Prefer derived query methods before custom `@Query`.
  - Use `Optional<T>` for nullable repository returns.
  - Put `@Transactional` on **service layer** methods, not repositories.

- **Entities & Persistence**
  - Annotate entities with `@Entity` and `@Table`.
  - Use meaningful constraints (`nullable=false`, `unique=true`, length, etc.) on `@Column`.
  - Use audit fields (`@CreatedDate`, `@LastModifiedDate`) and optimistic locking (`@Version`) where relevant.

- **Configuration**
  - Externalize configuration in `application.yml` / `application-*.yml`.
  - Use environment variables for secrets (e.g. DB credentials, JWT secrets).
  - Use `@ConfigurationProperties` for structured config instead of many `@Value` injections.
  - Use Spring profiles (`spring.profiles.active`) for env-specific configs (dev, test, prod).

- **Security**
  - Configure HTTP security via `SecurityFilterChain` bean (new Spring Security style).
  - Prefer stateless JWT-based auth for REST APIs (`SessionCreationPolicy.STATELESS`).
  - Clearly separate public endpoints (e.g. `/api/auth/**`) from protected ones.

- **Pagination & Sorting**
  - For list endpoints with potential growth, take `page`, `size`, and optional `sort` parameters.
  - Use `Pageable`/`Page<T>` from Spring Data for pagination responses.

- **Testing**
  - Use JUnit 5 + Mockito for unit tests (`@ExtendWith(MockitoExtension.class)`).
  - Use `@SpringBootTest` + `@AutoConfigureMockMvc` for integration tests.
  - Write unit tests for service logic and integration tests for controllers and critical flows.

- **General Best Practices**
  - Follow **convention over configuration**; use defaults unless you have a clear reason.
  - Keep methods small and focused; keep controllers and services under control in size.
  - Log important events and errors with structured messages (no stack traces printed directly).
